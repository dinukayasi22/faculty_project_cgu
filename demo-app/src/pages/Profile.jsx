import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { GoUpload } from "react-icons/go";
import { studentAPI, getUserData } from "../services/api";

// Default avatar URL
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await studentAPI.getProfile();
      const studentData = response.data.student;

      // Map backend fields to frontend format
      const mappedProfile = {
        fullName: studentData.fullName,
        studentId: studentData.studentId,
        qualification: studentData.qualification,
        gender: studentData.gender,
        address: studentData.address,
        contact: studentData.contactNo, // Backend: contactNo → Frontend: contact
        email: studentData.email,
        creditTable: studentData.pdcTableUrl, // Backend: pdcTableUrl → Frontend: creditTable
        cv: studentData.cvUrl,
        avatar: studentData.profilePictureUrl || DEFAULT_AVATAR, // Use default if no profile picture
        username: studentData.fullName,
        cvStatus: studentData.cvStatus,
        cvRejectionReason: studentData.cvRejectionReason,
      };

      setProfile(mappedProfile);
      setForm(mappedProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleGender = (gender) => {
    setForm((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Update basic profile fields
      const updateData = {
        fullName: form.fullName,
        qualification: form.qualification,
        address: form.address,
        contactNo: form.contact, // Frontend: contact → Backend: contactNo
      };

      await studentAPI.updateProfile(updateData);

      // Handle CV upload if changed
      if (form.cv && typeof form.cv !== "string") {
        const cvFormData = new FormData();
        cvFormData.append("cv", form.cv);
        await studentAPI.updateCV(cvFormData);
      }

      // Refresh profile data
      await fetchProfile();

      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile");
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setForm(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditMode(false);
    setError("");
  };

  // Extract filename from Google Drive URL
  const getFileName = (url) => {
    if (!url || typeof url !== "string") return "No file uploaded";
    if (url.startsWith("http")) {
      // Extract filename from URL or show "View File"
      return "View File";
    }
    return url;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-black mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#8B5C2B] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pb-14">
      {/* Heading */}
      <div className="pt-32 pb-2 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-black text-center">Profile</h1>
        <div className="mt-8 flex flex-col items-center">
          <div className="rounded-full border-8 border-[#EADFE1] p-2 mb-2">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR; // Fallback if image fails to load
              }}
            />
          </div>
          <div className="text-2xl font-semibold text-black mt-2 mb-4 text-center">
            {profile.username}
          </div>

          {/* CV Status Badge */}
          {profile.cvStatus && (
            <div className="mb-2">
              {profile.cvStatus === "pending" && (
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                  CV Status: Pending Review
                </span>
              )}
              {profile.cvStatus === "approved" && (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  CV Status: Approved ✓
                </span>
              )}
              {profile.cvStatus === "rejected" && (
                <div className="text-center">
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                    CV Status: Rejected
                  </span>
                  {profile.cvRejectionReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Reason: {profile.cvRejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full max-w-2xl mx-auto px-4 mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* Profile Details */}
      <div className="w-full flex flex-col items-center px-2">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Profile Details</h2>
            {!editMode && (
              <button
                type="button"
                onClick={handleEdit}
                className="text-2xl text-black cursor-pointer hover:text-[#8B5C2B]"
                aria-label="Edit Profile"
              >
                <FaRegEdit />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Full Name</div>
                {editMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mt-1 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="text-base">{profile.fullName}</div>
                )}
              </div>

              {/* Student ID */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Student ID</div>
                <div className="text-base">{profile.studentId}</div>
              </div>

              {/* Qualification */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Qualification</div>
                {editMode ? (
                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mt-1 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your qualification"
                  />
                ) : (
                  <div className="text-base">{profile.qualification}</div>
                )}
              </div>

              {/* Gender */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Gender</div>
                <div className="text-base capitalize">{profile.gender}</div>
              </div>

              {/* Address */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Address</div>
                {editMode ? (
                  <textarea
                    name="address"
                    value={form.address || ""}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mt-1 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="text-base">{profile.address}</div>
                )}
              </div>

              {/* Contact No */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Contact No</div>
                {editMode ? (
                  <input
                    type="tel"
                    name="contact"
                    value={form.contact || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mt-1 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your contact number"
                  />
                ) : (
                  <div className="text-base">{profile.contact}</div>
                )}
              </div>

              {/* Email */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">E mail</div>
                <div className="text-base">{profile.email}</div>
              </div>

              {/* Credit Table */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">
                  Professional development credit table
                </div>
                {profile.creditTable ? (
                  <a
                    href={profile.creditTable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 hover:underline"
                  >
                    {getFileName(profile.creditTable)}
                  </a>
                ) : (
                  <div className="text-base text-gray-500">No file uploaded</div>
                )}
              </div>

              {/* CV */}
              <div className="bg-secondary rounded-xl px-6 py-4">
                <div className="font-semibold text-lg">Uploaded CV</div>
                {editMode ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={
                        form.cv && typeof form.cv === "string"
                          ? getFileName(form.cv)
                          : form.cv?.name || ""
                      }
                      disabled
                      className="bg-transparent outline-none text-base flex-1"
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
                      <span className="bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-1">
                        <GoUpload className="w-4 h-4 " />
                        UPLOAD
                      </span>
                    </label>
                  </div>
                ) : profile.cv ? (
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 hover:underline"
                  >
                    {getFileName(profile.cv)}
                  </a>
                ) : (
                  <div className="text-base text-gray-500">No file uploaded</div>
                )}
              </div>

              {/* Submit/Cancel Buttons */}
              {editMode && (
                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#6B471B] text-white text-xl font-semibold rounded-xl py-3 px-8 hover:bg-[#8B5C2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-gray-300 text-black text-xl font-semibold rounded-xl py-3 px-8 hover:bg-gray-400 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
