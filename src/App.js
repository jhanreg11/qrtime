import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Teacher from './pages/Teacher';
import Student from './pages/Student';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route path="/teacher" component={Teacher} />
        <Route path="/student" component={Student} />
      </Routes>
    </Router>
  );
}

export default App;
