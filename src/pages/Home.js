import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>Please select an option below:</p>
      <button><Link to="/student">Student</Link></button>
      <button><Link to="/teacher">Teacher</Link></button>
    </div>
  );
}

export default Home;

