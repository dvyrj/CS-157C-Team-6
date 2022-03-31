import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Example from "./pages/example";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from './pages/profile';
import ErrorPage from "./pages/error";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/login">Login </Link>
        <Link to="/register">Register </Link>
        <Link to="/example">Example </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/example" element={<Example/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
