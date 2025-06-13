import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export const NavBar = () => {

  const navigate = useNavigate();
  const {user,setShowLogin,logout,credit} = useContext(AppContext);

  return (
    <div className="flex justify-between items-center py-4">
      <Link to="/">
        <img src={assets.logo} className="w-28 sm:w-32 lg:w-40" />
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={()=>navigate("/buy")} className="flex items-center gap-2 sm:gap-3 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-400 cursor-pointer">
              <img className="w-5" src={assets.credit_star} alt="credit_star" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Credits Left : {credit}
              </p>
            </button>
            <p className="text-gray-600 max-sm:hidden pl-4">Hii, {user.name}</p>
            <div className="relative group">
              <img
                className="w-10 drop-shadow"
                src={assets.profile_icon}
                alt="profile_icon"
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded p-12">
                <ul className="list-none m-0 py-1 font-medium px-2 bg-white rounded-lg border text-sm">
                  <li onClick={logout} className="px-2 py-1 cursor-pointer pr-5">Logout</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-5">
            <p onClick={() => navigate("/buy")} className="cursor-pointer">
              Pricing
            </p>
            <button onClick={()=>setShowLogin(true)} className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-lg rounded-full cursor-pointer">
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
