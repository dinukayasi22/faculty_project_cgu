import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaUserGraduate, FaBuilding } from "react-icons/fa";

const RegistrationChoice = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Back Button */}
            <button
                className="absolute top-24 left-4 md:left-8 text-3xl text-black hover:text-primary"
                onClick={() => navigate("/")}
            >
                <IoArrowBackSharp className="w-8 h-8" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-32">
                <h1 className="text-4xl md:text-5xl font-bold text-black text-center mb-4">
                    Choose Registration Type
                </h1>
                <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl">
                    Please select whether you want to register as a student or as a company
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Student Registration Card */}
                    <div
                        onClick={() => navigate("/register")}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary text-white rounded-full p-6 mb-6">
                                <FaUserGraduate className="w-16 h-16" />
                            </div>
                            <h2 className="text-2xl font-bold text-black mb-3">
                                Student Registration
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Register as a student to access job opportunities, upload your CV, and apply for positions
                            </p>
                            <button className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-[#8B5C2B] transition font-semibold">
                                Register as Student
                            </button>
                        </div>
                    </div>

                    {/* Company Registration Card */}
                    <div
                        onClick={() => navigate("/company-register")}
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-primary text-white rounded-full p-6 mb-6">
                                <FaBuilding className="w-16 h-16" />
                            </div>
                            <h2 className="text-2xl font-bold text-black mb-3">
                                Company Registration
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Register your company to post job openings and find talented candidates
                            </p>
                            <button className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-[#8B5C2B] transition font-semibold">
                                Register as Company
                            </button>
                        </div>
                    </div>
                </div>

                {/* Login Link */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-primary hover:underline font-semibold"
                        >
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationChoice;
