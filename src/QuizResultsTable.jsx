import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizResultsTable = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [resultsLength, setResultsLength] = useState(0)

  useEffect(() => {
    fetchQuizResults();
  }, [currentPage]);

  const fetchQuizResults = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/result/getall`);
      const allResults = response.data;
      setResultsLength(allResults.length)
      const startIndex = (currentPage - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      const paginatedResults = allResults.slice(startIndex, endIndex);
      setQuizResults(paginatedResults);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const renderTableRows = () => {
    return quizResults.map((result, index) => (
      <tr key={index}>
        <td className=" py-1 text-left pl-4">{result?.username}</td>
        <td className=" py-1 text-center pr-8">{result?.questions_asked}</td>
        <td className=" py-1 text-center pr-10">{result?.user_answered}</td>
        <td className=" py-1 text-center pr-10">{result?.correct_answer}</td>
        <td className=" py-1 text-center pr-6">{result?.correct_answer}</td>
      </tr>
    ));
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions Asked</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions Answered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correctly Answered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows()}
            </tbody>
        </table>
        </div>
        <div className="mt-4 flex justify-between">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Previous</button>
        <button onClick={handleNextPage} disabled={currentPage * 10 >= resultsLength} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Next</button>
        </div>
    </>
  );
};

export default QuizResultsTable;
