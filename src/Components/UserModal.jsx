import React, { useState } from 'react';

const UserModal = ({ onClose, onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(username);
    setUsername('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Enter Your Username</h2>
        <input
          type="text"
          className="border text-green-600 border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
        <div className="flex justify-end">
          <button
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="text-gray-600 ml-4 px-4 py-2 rounded-lg border border-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
