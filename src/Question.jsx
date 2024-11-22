import axios from "axios";
import React, { useEffect, useState } from "react";

const Question = ({ allCountries = [], user = '' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const numQuestions = 20;
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentUser, setCurrentUser] = useState({})

  // get latest user information
  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/getall');
        // Assuming the response data is an object containing user information
        const latestUser = response.data;
        console.log('Latest user:', latestUser[latestUser.length-1]);
        setCurrentUser(latestUser[latestUser.length-1])
        // You can set the latest user information to state here if needed
      } catch (error) {
        console.error('Error fetching latest user:', error);
      }
    };
  
    fetchLatestUser();
  }, []);

  useEffect(() => {
    // Generate questions when countries are loaded
    if (allCountries.length > 0) {
      const shuffledCountries = allCountries.sort(() => Math.random() - 0.5);
      const quizQuestions = shuffledCountries
        .slice(0, numQuestions)
        .map((country) => {
          const options = generateRandomOptions(
            country.name.common,
            allCountries
          );
          return {
            flag: country.flags.png,
            options,
            answer: options.indexOf(country.name.common),
            correct_answer: 0, // Initialize correct_answer for each question
          };
        });
      setQuestions(quizQuestions);
    }
  }, [allCountries]);

  const generateRandomOptions = (correctAnswer, allCountries) => {
    const options = [correctAnswer];
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * allCountries.length);
      const randomCountry = allCountries[randomIndex].name.common;
      if (!options.includes(randomCountry) && randomCountry !== correctAnswer) {
        options.push(randomCountry);
      }
    }
    return options.sort(() => Math.random() - 0.5); // Shuffle options for better randomization
  };

  const handleAnswerClick = (optionIndex) => {
    setQuestionsAnswered(questionsAnswered + 1);
    const question = questions[currentQuestion];
    if (optionIndex === question.answer) {
      setScore(score + 1);
      question.correct_answer++; // Update correct_answer count for the question
    }
    if (currentQuestion + 1 >= numQuestions) {
      setShowResults(true); // Show results if all questions have been answered
      sendQuizResults(); // Send quiz results to backend
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkipClick = () => {
    if (currentQuestion + 1 >= numQuestions) {
      setShowResults(true); // Show results if all questions have been answered
      sendQuizResults(); // Send quiz results to backend
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Function to send quiz results to backend
  const sendQuizResults = async () => {
    try {
      const response = await axios.post('http://localhost:8080/result/add', {
        user_id: currentUser?.user_id,
        questions_asked: numQuestions,
        user_answered: questionsAnswered,
        correct_answer: score,
        username: currentUser?.username,
        score: score,
      });
      console.log('Quiz results saved:', response.data);
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="my-4">
          Question {currentQuestion + 1} / {questions.length}
        </h2>
        <img style={{
          width: '320px',
          height: '180px',
          objectFit: 'contain',
          objectPosition: 'center',
        }} src={question?.flag} alt="Flag" />
        <ul className="my-4">
          {question?.options.map((option, index) => (
            <li key={index}>
              <button ></button>
              <button onClick={() => handleAnswerClick(index)} type="button" class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 focus:outline-none  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{option}</button>
            </li>
          ))}
        </ul>
        <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleSkipClick}>Skip</button>
      </div>
    );
  };

  const renderResults = () => {
    const totalQuestions = questions.length;
    const attempted = totalQuestions - (currentQuestion + 1); // Account for unanswered questions
    const correctAnswers = questions.reduce((sum, q) => sum + q.correct_answer, 0);
    return (
      <div>
        <h2 className="text-3xl">Results</h2>
        <p className="text-2xl mt-8">
          Hey
          <span className="text-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-2 mx-2 font-medium rounded-lg py-2.5 text-center me-2">
          {currentUser?.username}
            </span> 
          , You answered {questionsAnswered} out of {totalQuestions} questions.
        </p>
        <p  className="text-2xl mb-4 mt-8">
          Total correct answers:{" "}
          {correctAnswers}
        </p>
        <button className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-10"  onClick={() => window.location.reload()}>Restart Quiz</button>
      </div>
    );
  };

  return (
    <section className="relative p-20 w-full h-full flex flex-col items-center justify-start text-white bg-opacity-20 bg-black">
      <p style={{ opacity: showResults ? '0' : '1' }} className="absolute top-24 right-36 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{user}</p>
      {!showResults && <h1 className="text-6xl mb-12">What Country Does This Flag Represent?</h1>}
      {showResults ? renderResults() : renderQuestion()}
    </section>
  );
};

export default Question;
