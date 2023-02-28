import React, { useState } from 'react';
import QRCode from 'qrcode.react';

function Student() {
  const [name, setName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [studentIDError, setStudentIDError] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
    setNameError(false);
  };

  const handleStudentIDChange = (event) => {
    setStudentID(event.target.value);
    setStudentIDError(false);
  };

  const handleQRCodeGeneration = (event) => {
    event.preventDefault();

    let isValid = true;

    if (!/^[a-zA-Z\s]*$/.test(name)) {
      setNameError(true);
      isValid = false;
    }

    if (!/^\d{5}$/.test(studentID)) {
      setStudentIDError(true);
      isValid = false;
    }

    if (isValid) {
      setShowQRCode(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleQRCodeGeneration}>
        <label htmlFor="nameInput">Enter Name:</label>
        <input type="text" id="nameInput" value={name} onChange={handleNameChange} />
        {nameError && <div className="error">Name should contain only letters and spaces</div>}
        <label htmlFor="studentIDInput">Enter Student ID:</label>
        <input type="text" id="studentIDInput" value={studentID} onChange={handleStudentIDChange} />
        {studentIDError && <div className="error">Student ID should be a 5 digit number</div>}
        <button type="submit">Generate QR Code</button>
      </form>
      {showQRCode && <QRCode value={`${name} ${studentID}`} />}
    </div>
  );
}

export default Student;

