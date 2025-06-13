import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setUser, setToken } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleForgotPasswordCall = () => {
    navigate("/forgot-password");
    setShowLogin(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl font-medium text-neutral-700">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-4 py-0 flex items-center gap-2 rounded-full mt-5">
            <div className="w-8">
              <img src={assets.profile_icon} alt="iconUser" />
            </div>
            <input
              onChange={(e) => setName(e.target.value)}
              className="outline-none text-sm"
              type="text"
              required
              value={name}
              placeholder="Full Name"
            />
          </div>
        )}
        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-4">
          <div className="w-8">
            <img className="px-2" src={assets.email_icon} alt="iconemail" />
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none text-sm"
            type="email"
            required
            value={email}
            placeholder="Email"
          />
        </div>
        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-4">
          <div className="w-8">
            <img className="px-2" src={assets.lock_icon} alt="iconlock" />
          </div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none text-sm"
            type="password"
            required
            value={password}
            placeholder="password"
          />
        </div>
        <p
          onClick={handleForgotPasswordCall}
          className="text-sm text-blue-600 my-4 cursor-pointer"
        >
          Forgot password?
        </p>
        <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">
          {state === "Login" ? "Login" : " Create Account"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="cross_icon"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};
