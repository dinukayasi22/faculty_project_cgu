import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegistrationChoice from "./pages/RegistrationChoice";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Contact from "./pages/Contact";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import JobView from "./pages/JobView";
import EmployerPortal from "./pages/EmployerPortal";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Regular Navbar for all routes */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Student Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registration-choice" element={<RegistrationChoice />} />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/apply-job" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ApplyJob />
            </ProtectedRoute>
          } />

          {/* Company Routes */}
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/employer-portal" element={<EmployerPortal />} />
          <Route path="/company-dashboard" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute allowedRoles={['company']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/job-view/:id" element={
            <ProtectedRoute allowedRoles={['company']}>
              <JobView />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Footer for all routes */}
      <Footer />
    </div>
  );
}

export default App;
