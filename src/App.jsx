import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Cs from "./pages/Cs";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="/home" element={<Home />} />
         <Route path="/cs" element={<Cs />} />
      </Routes>
    </Router>
  );
};

export default App;
