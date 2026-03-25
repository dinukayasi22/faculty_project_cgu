import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobsData } from "../data/jobsData";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { PiSuitcaseSimpleBold } from "react-icons/pi";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobsData.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="text-2xl text-red-600">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-2 sm:px-4 py-8 mt-18">
      <div className="max-w-4xl mx-auto">
        <button
          className="mb-4 text-3xl text-black hover:text-primary"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <IoArrowBackSharp className="w-8 h-8" />
        </button>
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <img
            src={job.logo}
            alt="logo"
            className="w-20 h-20 rounded-2xl object-cover mx-auto md:mx-0"
          />
          <div className="flex-1">
            <div className="text-2xl font-bold text-black">{job.company} Name</div>
            <div className="text-lg font-bold text-gray-700">{job.group}</div>
            <div className="flex gap-6 mt-2 text-gray-700 text-base flex-wrap">
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
          <div className="flex md:flex-1 justify-end mt-4 md:mt-0">
            <button
              className="border-2 border-gray-700 text-gray-700 font-bold rounded-xl px-8 py-3 text-lg hover:bg-gray-100"
              onClick={() => navigate(`/apply-job?id=${job.id}`)}
            >
              Apply this Job
            </button>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-2xl font-bold text-gray-700 mb-2">Description :</div>
          <div className="text-base text-gray-800 mb-6 whitespace-pre-line">{job.description}</div>
          <div className="text-2xl font-bold text-gray-700 mb-2">Role Purpose :</div>
          <div className="text-base text-gray-800 mb-6 whitespace-pre-line">{job.rolePurpose}</div>
          <div className="text-2xl font-bold text-gray-700 mb-2">Key Responsibilities :</div>
          <div className="text-base text-gray-800 mb-6 whitespace-pre-line">{job.responsibilities}</div>
          <div className="text-2xl font-bold text-gray-700 mb-2">Role Requirments :</div>
          <div className="text-base text-gray-800 mb-6 whitespace-pre-line">{job.requirements}</div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;