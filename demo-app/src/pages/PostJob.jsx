import React, { useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { postJobImages } from "../assets/images/assets";
import RichTextEditor from "../components/RichTextEditor";
import { companyAPI } from "../services/api";

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    title: "",
    salary: "",
    timings: "",
    requiredQualifications: "",
    requiredExperience: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await companyAPI.postJob(form);
      alert("Job posted successfully!");
      navigate("/company-dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Post a Job
        </h1>
        <div className="mt-4 w-full flex justify-center">
          <div className="bg-background-muted rounded-full px-4 sm:px-20 md:px-40 lg:px-60 py-2 text-center text-base md:text-lg text-gray-700 font-normal">
            Please enter correct details about your job
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center bg-secondary justify-center mt-8 mb-16 py-8">
        <div className="w-full md:flex-1 md:pl-4 lg:pl-40 max-w-4xl">
          <form
            className="w-full p-4 md:p-8 rounded-xl backdrop-blur-sm"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl text-center md:text-3xl font-bold text-primary mb-6">
              Job Details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Category (e.g., Software Development)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
              <input
                type="text"
                placeholder="Job Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
              <input
                type="text"
                placeholder="Salary (e.g., $50,000 - $70,000)"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              />
              <input
                type="text"
                placeholder="Timings (e.g., 9 AM - 5 PM)"
                value={form.timings}
                onChange={(e) => setForm({ ...form, timings: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              />
              <textarea
                placeholder="Required Qualifications"
                value={form.requiredQualifications}
                onChange={(e) => setForm({ ...form, requiredQualifications: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border h-24 resize-none"
                required
              />
              <textarea
                placeholder="Required Experience"
                value={form.requiredExperience}
                onChange={(e) => setForm({ ...form, requiredExperience: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border h-24 resize-none"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description (Rich Text)
                </label>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => setForm({ ...form, description: value })}
                  placeholder="Describe the job role, responsibilities, and requirements in detail..."
                />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl hover:bg-[#8B5C2B] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
        <div className="hidden md:block md:flex-1">
          <img
            src={postJobImages.PostJob}
            alt="Post Job"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default PostJob;
