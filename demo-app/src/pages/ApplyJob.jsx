import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoUpload } from "react-icons/go";
import { IoArrowBackSharp } from "react-icons/io5";

const initialForm = {
  resume: null,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  heardAbout: "",
};

const ApplyJob = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const validate = () => {
    const newErrors = {};
    if (!form.resume) newErrors.resume = "Resume is required";
    if (!form.firstName) newErrors.firstName = "First Name is required";
    if (!form.lastName) newErrors.lastName = "Last Name is required";
    if (!form.phone) newErrors.phone = "Phone Number is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      alert("Application submitted!\n" + JSON.stringify(form, null, 2));
      navigate("/jobs");
    }
  };

  return (
    <div className="bg-white min-h-screen px-4 py-8 mt-18 pb-28">
      <div className="max-w-2xl mx-auto">
        <button
          className="mb-4 text-3xl text-black hover:text-primary"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <IoArrowBackSharp className="w-8 h-8" />
        </button>
        <h1 className="text-4xl font-bold text-center mb-8 mt-8 text-gray-800">
          Apply for this Job
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Resume Upload */}
          <div>
            <label className="text-xl font-bold text-gray-800 mb-2 block">
              Resume / CV :
            </label>
            <div className="bg-white border rounded-xl px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer">
              <label className="w-full flex flex-col items-center cursor-pointer">
                <GoUpload className="text-4xl text-primary mb-2" />
                <span className="text-lg text-gray-700">
                  Click or drag file to this area to upload your Resume
                </span>
                <span className="text-base text-gray-500">
                  Please make sure to upload a PDF
                </span>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {form.resume && (
                <div className="mt-2 text-green-700 text-sm">
                  {form.resume.name}
                </div>
              )}
              {errors.resume && (
                <div className="text-danger text-sm mt-2">{errors.resume}</div>
              )}
            </div>
          </div>
          {/* First Name */}
          <div>
            <label className="text-lg font-bold text-gray-800 mb-1 block">
              First Name : <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-lg outline-none ${
                errors.firstName ? "border-danger" : ""
              }`}
            />
            {errors.firstName && (
              <div className="text-danger text-sm mt-1">{errors.firstName}</div>
            )}
          </div>
          {/* Last Name */}
          <div>
            <label className="text-lg font-bold text-gray-800 mb-1 block">
              Last Name : <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-lg outline-none ${
                errors.lastName ? "border-danger" : ""
              }`}
            />
            {errors.lastName && (
              <div className="text-danger text-sm mt-1">{errors.lastName}</div>
            )}
          </div>
          {/* Phone Number */}
          <div>
            <label className="text-lg font-bold text-gray-800 mb-1 block">
              Phone Number : <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-lg outline-none ${
                errors.phone ? "border-danger" : ""
              }`}
            />
            {errors.phone && (
              <div className="text-danger text-sm mt-1">{errors.phone}</div>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="text-lg font-bold text-gray-800 mb-1 block">
              E mail : <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-lg outline-none ${
                errors.email ? "border-danger" : ""
              }`}
            />
            {errors.email && (
              <div className="text-danger text-sm mt-1">{errors.email}</div>
            )}
          </div>
          {/* How did you hear */}
          <div>
            <label className="text-lg font-bold text-gray-800 mb-1 block">
              How did you hear about this position?
            </label>
            <input
              type="text"
              name="heardAbout"
              value={form.heardAbout}
              onChange={handleChange}
              className="w-full bg-white border rounded-xl px-4 py-3 text-lg outline-none"
            />
          </div>
          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-primary text-white font-bold text-xl rounded-xl px-8 py-3 hover:bg-[#8B5C2B] transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
