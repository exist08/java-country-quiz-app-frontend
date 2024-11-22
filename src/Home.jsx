import React, { useState } from "react";
import UserModal from "./Components/UserModal";
import axios from "axios";
import QuizResultsTable from "./QuizResultsTable";

const Home = ({ quizStart, setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuModal, setMenuModal] = useState(false);
  const [errorText, setErrorText] = useState('')

  const handleQuizStart = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUsernameSubmit = async (username) => {
    try {
      // Send POST request to the backend endpoint
      const response = await axios.post("http://localhost:8080/user/add", {
        username: username,
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Username submitted and saved successfully:", username);
        quizStart();
        setUser(username)
    } else {
        console.error("Failed to save username:", response.statusText);
        setErrorText("Failed to save username")
      }
    } catch (error) {
      console.error("Error while saving username:", error.message);
      setErrorText("Error while saving username")
    }
  };

  return (
    <section className="relative p-20 w-full h-full flex flex-col items-center justify-start text-white bg-opacity-20 bg-black">
      <h1 className="text-8xl">Countries Quiz</h1>
      <p className="mt-6 text-3xl">Are You a Country Whiz? Take the Quiz!</p>
      <button
        onClick={handleQuizStart}
        className="mt-10 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
      >
        I'm gonna take it 😤
      </button>

      <p className="text-red-500">{errorText}</p>
      {isModalOpen && (
        <UserModal onClose={handleCloseModal} onSubmit={handleUsernameSubmit} />
      )}

      <button className="absolute top-28 right-28 text-4xl text-white" onClick={() => setMenuModal(true)}>
        <ion-icon name="list-circle-outline"></ion-icon>
      </button>
      {menuModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white shadow-lg rounded-lg p-8 w-4/6 h-2/3">
            <div className="w-full h-full p-6 text-black">
                <h1 className="text-3xl font-bold">Quiz History</h1>
                <QuizResultsTable />
            </div>
          <button
            onClick={()=>setMenuModal(false)}
            className="absolute text-3xl top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
      </div>
      )}
    </section>
  );
};

export default Home;
