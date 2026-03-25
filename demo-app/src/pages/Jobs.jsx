import React from "react";
import { jobsData } from "../data/jobsData";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { PiSuitcaseSimpleBold } from "react-icons/pi";

const Jobs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen px-4 py-8 mt-18 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-black mb-8 mt-8 w-5/6">
          Find your dream job or let companies find you
        </h1>
        {/* Search bar */}
        <div className="bg-background-muted rounded-xl flex flex-col md:flex-row items-center gap-2 px-4 py-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xl text-gray-400">
              <IoMdSearch className="w-8 h-8" />
            </span>
            <input
              type="text"
              placeholder="Jobs or keyword"
              className="bg-transparent outline-none w-full text-lg"
              // disabled
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xl text-gray-400">
              <IoLocationSharp className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Anywhere"
              className="bg-transparent outline-none w-full text-lg"
              // disabled
            />
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <select className="bg-white border rounded px-4 py-2">
            <option>Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <select className="bg-white border rounded px-4 py-2">
            <option>Modality</option>
            <option>Onsite</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
          <select className="bg-white border rounded px-4 py-2">
            <option>Country</option>
            <option>Sri Lanka</option>
            <option>India</option>
            <option>UK</option>
            <option>USA</option>
          </select>
          <select className="bg-white border rounded px-4 py-2">
            <option>Salary</option>
            <option>Below $500</option>
            <option>$500 - $1000</option>
            <option>$1000 - $2000</option>
            <option>Above $2000</option>
          </select>
        </div>
        <div className="text-2xl font-bold mb-6">500 Total Jobs</div>
        {/* Job List */}
        <div className="flex flex-col gap-6">
          {jobsData.map((job) => (
            <div
              key={job.id}
              className="bg-background-muted rounded-2xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={job.logo}
                  alt="logo"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="text-xl font-bold text-black">
                    {job.title}
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {job.company}
                  </div>
                  <div className="text-gray-600">{job.group}</div>
                  <div className="flex gap-4 mt-2 text-gray-700 text-base">
                    <span className="flex items-center gap-1">
                      <PiSuitcaseSimpleBold className="text-gray-600" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <IoLocationSharp className="text-gray-600" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="bg-accent text-white font-semibold rounded-lg px-8 py-3 text-lg hover:bg-blue-700"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;