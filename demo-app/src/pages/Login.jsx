import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginImages } from "../assets/images/assets";
import { authAPI, setAuthToken, setUserData } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await authAPI.loginStudent({
          email: form.email,
          password: form.password,
        });

        // Backend returns { token, user } not { token, student }
        const { token, user } = response.data;

        setAuthToken(token);
        setUserData(user, 'student');

        // Dispatch event to update Navbar
        window.dispatchEvent(new Event('authChange'));

        // Check CV status and redirect accordingly
        if (user.cvStatus === 'rejected') {
          alert(`Your CV was rejected. Reason: ${user.cvRejectionReason || 'Not specified'}. Please update your CV.`);
        } else if (user.cvStatus === 'pending') {
          alert('Your CV is pending admin approval. You can browse jobs but cannot apply yet.');
        }

        navigate("/profile");
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
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
        <h1 className="text-5xl font-bold text-black text-center">LOGIN</h1>
        <div className="mt-4 w-full flex justify-center">
          <div className="bg-background-muted rounded-full px-6 sm:px-20 md:px-40 lg:px-60 py-2 text-center text-lg text-gray-700 font-normal">
            Please login to continue
          </div>
        </div>
      </div>
      {/* Background Image and Form */}
      <div
        className="flex-1 flex items-center justify-center mt-8 mb-16 px-2 sm:px-4 py-8"
        style={{
          backgroundImage: `url(${loginImages.LoginBg})`,
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
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.email ? "border border-danger" : ""
                  }`}
              />
              {errors.email && (
                <div className="text-danger text-sm px-2">{errors.email}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl px-6 py-4 text-lg outline-none mb-2 ${errors.password ? "border border-danger" : ""
                  }`}
              />
              {errors.password && (
                <div className="text-danger text-sm px-2">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between text-black text-base gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="accent-primary"
                />
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white text-xl font-semibold rounded-xl py-3 mt-2 hover:bg-[#8B5C2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center text-black text-lg mt-2">
              New User ?{" "}
              <a
                href="/register"
                className="text-[#6B471B] font-semibold hover:text-accent"
              >
                Register now
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
