import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyRegisterImages } from "../assets/images/assets";
import { IoArrowBackSharp } from "react-icons/io5";
import { GoUpload } from "react-icons/go";
import { authAPI } from "../services/api";

const initialForm = {
  companyName: "",
  employerPost: "",
  address: "",
  businessType: "",
  contactDetails: "",
  introduction: "",
  email: "",
  password: "",
  confirmPassword: "",
  logo: null,
};

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.companyName) newErrors.companyName = "Company name is required";
    if (!form.employerPost) newErrors.employerPost = "Employer post is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.businessType) newErrors.businessType = "Business type is required";
    if (!form.contactDetails) newErrors.contactDetails = "Contact details are required";
    if (!form.introduction || form.introduction.length < 20) {
      newErrors.introduction = "Introduction must be at least 20 characters";
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("companyName", form.companyName);
        formData.append("employerPost", form.employerPost);
        formData.append("address", form.address);
        formData.append("businessType", form.businessType);
        formData.append("contactDetails", form.contactDetails);
        formData.append("introduction", form.introduction);
        formData.append("email", form.email);
        formData.append("password", form.password);

        // Append logo if provided
        if (form.logo) {
          formData.append("logo", form.logo);
        }

        await authAPI.registerCompany(formData);

        alert("Registration successful! Your account is pending admin approval. Please login after approval.");
        navigate("/company-login");
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
      {/* Back Button */}
      <button
        className="absolute top-24 left-4 md:left-8 text-3xl text-black hover:text-primary"
        onClick={() => navigate(-1)}
      >
        <IoArrowBackSharp className="w-8 h-8" />
      </button>

      <div className="pt-32 pb-2 flex flex-col items-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-black text-center">
          Company Registration
        </h1>
        <div className="mt-4 w-full flex justify-center">
          <div className="bg-background-muted rounded-full px-4 sm:px-20 md:px-40 lg:px-60 py-2 text-center text-base md:text-lg text-gray-700 font-normal">
            Please fill in your company details
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center bg-secondary justify-center mt-8 mb-16 py-8 px-4">
        <div className="hidden md:block md:flex-1 md:pr-4 lg:pr-20">
          <img
            src={companyRegisterImages.CompanyRegisterImg}
            alt="Company Register"
            className="w-full max-w-md mx-auto h-auto object-contain"
          />
        </div>
        <div className="w-full md:flex-1 md:pr-4 lg:pr-40 max-w-xl">
          <form
            className="w-full p-4 md:p-8 rounded-xl backdrop-blur-sm"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="text-2xl text-center md:text-3xl font-bold text-primary mb-6">
              Register Your Company
            </h2>
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.companyName && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.companyName}</div>
                )}
              </div>

              {/* Employer Post */}
              <div>
                <input
                  type="text"
                  name="employerPost"
                  placeholder="Employer Post/Position"
                  value={form.employerPost}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.employerPost ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.employerPost && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.employerPost}</div>
                )}
              </div>

              {/* Business Type */}
              <div>
                <input
                  type="text"
                  name="businessType"
                  placeholder="Business Type (e.g., IT, Manufacturing, Retail)"
                  value={form.businessType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.businessType ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.businessType && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.businessType}</div>
                )}
              </div>

              {/* Address */}
              <div>
                <textarea
                  name="address"
                  placeholder="Company Address"
                  value={form.address}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.address ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.address && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.address}</div>
                )}
              </div>

              {/* Contact Details */}
              <div>
                <input
                  type="tel"
                  name="contactDetails"
                  placeholder="Contact Number"
                  value={form.contactDetails}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.contactDetails ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.contactDetails && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.contactDetails}</div>
                )}
              </div>

              {/* Introduction */}
              <div>
                <textarea
                  name="introduction"
                  placeholder="Company Introduction (min 20 characters)"
                  value={form.introduction}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.introduction ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.introduction && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.introduction}</div>
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
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.email && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.email}</div>
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
                  className={`w-full px-4 py-3 rounded-xl border ${errors.password ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.password && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1 px-2">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Logo Upload */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.logo ? form.logo.name : "Upload Company Logo (Optional)"}
                  disabled
                  className="bg-white rounded-xl px-4 py-3 text-base flex-1 outline-none border border-gray-300"
                  tabIndex={-1}
                />
                <label className="relative">
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="bg-primary hover:bg-[#8B5C2B] text-white font-semibold px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-1">
                    <GoUpload className="w-4 h-4" />
                    UPLOAD
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl hover:bg-[#8B5C2B] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a
                  href="/company-login"
                  className="text-primary hover:underline font-semibold"
                >
                  Login here
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
