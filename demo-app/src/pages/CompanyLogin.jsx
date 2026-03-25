import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyLoginImages } from "../assets/images/assets";
import { IoArrowBackSharp } from "react-icons/io5";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    navigate("/company-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Back Button */}
      <button
        className="absolute top-24 left-4 md:left-8 text-3xl text-black hover:text-primary"
        onClick={() => navigate(-1)}
      >
        <IoArrowBackSharp className="w-8 h-8" />
      </button>

      <div className="pt-32 pb-2 flex flex-col items-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-black text-center">
          Login page for job seekers
        </h1>
        <div className="mt-4 w-full flex justify-center">
          <div className="bg-background-muted rounded-full px-4 sm:px-20 md:px-40 lg:px-60 py-2 text-center text-base md:text-lg text-gray-700 font-normal">
            Please login to continue
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center bg-secondary justify-center mt-8 mb-16 py-8">
        <div className="w-full md:flex-1 md:pl-4 lg:pl-40 max-w-xl">
          <form
            className="w-full p-4 md:p-8 rounded-xl backdrop-blur-sm"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl text-center md:text-3xl font-bold text-primary mb-6">
              Login
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter User Name"
                className="w-full px-4 py-3 rounded-xl border"
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-xl border"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember Me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forget Password
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl hover:bg-[#8B5C2B]"
              >
                Login
              </button>
              <div className="text-center">
                <span className="text-gray-600">New User? </span>
                <a
                  href="/company-register"
                  className="text-primary hover:underline"
                >
                  Register now
                </a>
              </div>
            </div>
          </form>
        </div>
        <div className="hidden md:block md:flex-1">
          <img
            src={companyLoginImages.CompanyLoginVector}
            alt="Company Login"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
