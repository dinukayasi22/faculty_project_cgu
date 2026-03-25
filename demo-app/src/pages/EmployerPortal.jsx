import React from "react";
import { useNavigate } from "react-router-dom";
import { employerPortalImages } from "../assets/images/assets";

const EmployerPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-8 mt-18 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 md:mb-6">
            Indeed for Employers login
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Log in to your Indeed for Employers dashboard to manage your job post, 
            find resumes, and start interviewing candidates.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-16">
          {/* Left: Illustration */}
          <div className="w-full lg:flex-1 max-w-lg lg:max-w-none">
            <img
              src={employerPortalImages.EmployerPortalImg}
              alt="Employer Dashboard Illustration"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>

          {/* Right: Action Buttons */}
          <div className="w-full lg:flex-1 max-w-md flex flex-col gap-4 md:gap-6 px-4 lg:px-0 lg:pr-8 xl:pr-20">
            <button
              onClick={() => navigate("/company-login")}
              className="bg-accent text-white font-bold text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-blue-700 transition duration-300 w-full"
            >
              Go to employer dashboard
            </button>
            <button
              onClick={() => navigate("/post-job")}
              className="bg-accent text-white font-bold text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-blue-700 transition duration-300 w-full"
            >
              Post a new job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;