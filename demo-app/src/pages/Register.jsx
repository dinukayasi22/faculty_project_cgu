import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerImages } from "../assets/images/assets";
import { GoUpload } from "react-icons/go";
import { authAPI } from "../services/api";

const initialForm = {
  fullName: "",
  studentId: "",
  qualification: "",
  gender: "male",
  address: "",
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",
  creditTable: null,
  cv: null,
  profilePicture: null,
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Full Name is required";
    if (!form.studentId) newErrors.studentId = "Student ID is required";
    if (!form.qualification)
      newErrors.qualification = "Qualification is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.contact) newErrors.contact = "Contact No is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.cv) newErrors.cv = "Please upload your CV";
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

  const handleGender = (gender) => {
    setForm((prev) => ({
      ...prev,
      gender,
    }));
    setErrors((prev) => ({
      ...prev,
      gender: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("studentId", form.studentId);
        formData.append("qualification", form.qualification);
        formData.append("gender", form.gender);
        formData.append("address", form.address);
        formData.append("contactNo", form.contact);
        formData.append("email", form.email);
        formData.append("password", form.password);

        // Append files
        if (form.cv) formData.append("cv", form.cv);
        if (form.creditTable) formData.append("pdcTable", form.creditTable);
        if (form.profilePicture) formData.append("profilePicture", form.profilePicture);

        await authAPI.registerStudent(formData);

        alert("Registration successful! Your CV is pending admin approval. Please login.");
        navigate("/login");
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Registration failed. Please try again.";
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Heading */}
      <div className="pt-32 pb-2 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-black text-center">Register</h1>
        <div className="mt-4 w-full flex justify-center">
          <div className="bg-background-muted rounded-full px-6 sm:px-20 md:px-40 lg:px-60 py-2 text-center text-lg text-gray-700 font-normal">
            Please fill the correct details
          </div>
        </div>
      </div>
      {/* Background Image and Form */}
      <div
        className="flex-1 flex items-center justify-center mt-8 mb-16 px-2 sm:px-4 py-8"
        style={{
          backgroundImage: `url(${registerImages.RegisterBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form
          className="w-full max-w-2xl px-0 sm:px-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="bg-secondary/60 bg-opacity-30 rounded-3xl p-4 sm:p-8 md:p-12 flex flex-col gap-6 shadow-lg">
            {/* Full Name */}
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.fullName ? "border border-danger" : ""
                  }`}
              />
              {errors.fullName && (
                <div className="text-danger text-sm px-2">
                  {errors.fullName}
                </div>
              )}
            </div>
            {/* Student ID */}
            <div>
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={form.studentId}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.studentId ? "border border-danger" : ""
                  }`}
              />
              {errors.studentId && (
                <div className="text-danger text-sm px-2">
                  {errors.studentId}
                </div>
              )}
            </div>
            {/* Qualification */}
            <div>
              <input
                type="text"
                name="qualification"
                placeholder="Qulification"
                value={form.qualification}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.qualification ? "border border-danger" : ""
                  }`}
              />
              {errors.qualification && (
                <div className="text-red-600 text-sm px-2">
                  {errors.qualification}
                </div>
              )}
            </div>
            {/* Gender */}
            <div>
              <div className="flex items-center gap-4 bg-transparent px-2 py-2">
                <span className="text-base text-black">Gender</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === "male"}
                    onChange={() => handleGender("male")}
                    className="accent-primary"
                  />
                  <span className="text-base text-black">Male</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === "female"}
                    onChange={() => handleGender("female")}
                    className="accent-primary"
                  />
                  <span className="text-base text-black">Female</span>
                </label>
              </div>
              {errors.gender && (
                <div className="text-danger text-sm px-2">{errors.gender}</div>
              )}
            </div>
            {/* Address */}
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.address ? "border border-danger" : ""
                  }`}
              />
              {errors.address && (
                <div className="text-danger text-sm px-2">{errors.address}</div>
              )}
            </div>
            {/* Contact No */}
            <div>
              <input
                type="text"
                name="contact"
                placeholder="Contact No"
                value={form.contact}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.contact ? "border border-danger" : ""
                  }`}
              />
              {errors.contact && (
                <div className="text-danger text-sm px-2">{errors.contact}</div>
              )}
            </div>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.email ? "border border-danger" : ""
                  }`}
              />
              {errors.email && (
                <div className="text-danger text-sm px-2">{errors.email}</div>
              )}
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.password ? "border border-danger" : ""
                  }`}
              />
              {errors.password && (
                <div className="text-danger text-sm px-2">{errors.password}</div>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.confirmPassword ? "border border-danger" : ""
                  }`}
              />
              {errors.confirmPassword && (
                <div className="text-danger text-sm px-2">{errors.confirmPassword}</div>
              )}
            </div>
            {/* Credit Table Upload */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="Profecional Develpment Credit Table"
                disabled
                className="bg-secondary rounded-xl px-4 py-3 text-base flex-1 outline-none"
                tabIndex={-1}
              />
              <label className="relative">
                <input
                  type="file"
                  name="creditTable"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="bg-danger hover:bg-[#C82333] text-white font-semibold px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-1">
                  <GoUpload className="w-4 h-4 " />
                  UPLOAD
                </span>
              </label>
            </div>
            {errors.creditTable && (
              <div className="text-danger text-sm px-2">
                {errors.creditTable}
              </div>
            )}
            {/* Profile Picture Upload */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="Upload Profile Picture (Optional)"
                disabled
                className="bg-secondary rounded-xl px-4 py-3 text-base flex-1 outline-none"
                tabIndex={-1}
              />
              <label className="relative">
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="bg-primary hover:bg-[#8B5C2B] text-white font-semibold px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-1">
                  <GoUpload className="w-4 h-4 " />
                  UPLOAD
                </span>
              </label>
            </div>
            {/* CV Upload */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="Upload Your CV"
                disabled
                className="bg-secondary rounded-xl px-4 py-3 text-base flex-1 outline-none"
                tabIndex={-1}
              />
              <label className="relative">
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="bg-danger hover:bg-[#C82333] text-white font-semibold px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-1">
                  <GoUpload className="w-4 h-4 " />
                  UPLOAD
                </span>
              </label>
            </div>
            {errors.cv && (
              <div className="text-danger text-sm px-2">{errors.cv}</div>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white text-xl font-semibold rounded-xl py-3 mt-2 hover:bg-[#8B5C2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
