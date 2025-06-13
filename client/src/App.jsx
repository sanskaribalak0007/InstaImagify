import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { AppContext } from "./context/AppContext";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
const App = () => {
  const { showLogin } = useContext(AppContext);
  return (
    <div className="px-4 sm:px-10 md:px-18 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer
        position="bottom-right"
        autoClose={5000} // close after 5 seconds
        hideProgressBar={false} // show progress bar
        closeOnClick={true} // close on click
      />
      <NavBar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/forgot-password" element={ <ForgotPassword/>}/>
        <Route path="/reset-password" element={ <ResetPassword/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
