import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { CgCalendarDates } from "react-icons/cg";

const jobsList = [
  {
    id: 1,
    title: "Employer Job Position",
    salary: "$2000",
    type: "Full Time/Part Time",
    location: "Hybrid or On-Site",
    date: "20/01/2025",
  },
  // Add more sample jobs as needed
];

const CompanyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-8 mt-18">
      <div className="max-w-4xl mx-auto">
        <button
          className="mb-4 text-3xl text-black hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackSharp className="w-8 h-8" />
        </button>

        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
            alt="Company Logo"
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold">Company Name</h1>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Your All Posted Jobs</h2>

        <div className="flex flex-col gap-4 mt-4">
          {jobsList.map((job) => (
            <div key={job.id} className="bg-background-muted rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-red-600">{job.salary}</p>
                  <div className="mt-2 text-gray-600">
                    <p>{job.location}</p>
                  </div>
                  <div className="mt-2 flex gap-28 text-gray-600">
                    <div className="flex items-center">
                      <PiSuitcaseSimpleBold className="inline-block mr-1 text-gray-600" />
                      <p>{job.type}</p>
                    </div>

                    <div className="flex items-center">
                      <CgCalendarDates className="inline-block mr-1 text-gray-600" />
                      <p>{job.date}</p>
                    </div>
                  </div>
                </div>
                <button className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Delete Job
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-[#8B5C2B]"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-[#8B5C2B]">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
