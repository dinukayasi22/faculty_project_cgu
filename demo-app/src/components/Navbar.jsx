import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navbarImages } from "../assets/images/assets";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { getUserData, removeAuthToken } from "../services/api";

const menuItems = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "About Us", path: "/about" },
  { id: 3, name: "Jobs", path: "/jobs" },
  { id: 4, name: "Blog", path: "/blog" },
  { id: 5, name: "Contact", path: "/contact" },
  { id: 6, name: "Profile", path: "/profile" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const { user, role } = getUserData();
      setIsLoggedIn(!!user);
      setUserRole(role);
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);

    // Custom event for same-tab login/logout
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setUserRole(null);

    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));

    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={navbarImages.Logo}
              alt="LOGO"
              className="w-16 h-16 object-cover rounded-full flex-shrink-0 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            />
            <div className="flex flex-col leading-tight text-text-muted text-2xl font-bold min-w-0">
              <h1 className="truncate">Rajarata University of Sri Lanka</h1>
              <span className="font-medium text-lg whitespace-nowrap truncate">
                Career Guidance Unit
              </span>
            </div>
          </div>

          {/* Right: Menu Items */}
          <div className="hidden md:flex gap-4 items-center">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-text-muted bg-accent px-3 py-0.5 rounded-full"
                    : "text-text hover:text-text-muted bg-background-muted hover:bg-accent px-3 py-0.5 rounded-full"
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Conditional rendering based on authentication */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-text-muted px-4 py-1.5 rounded-full border border-text-muted hover:bg-red-500 hover:border-red-500 transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="text-text-muted px-3 py-0.5 rounded-full border border-text-muted hover:bg-accent cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => (window.location.href = "/registration-choice")}
                  className="text-text-muted px-3 py-0.5 rounded-full border border-text-muted hover:bg-accent cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
              aria-label="Main menu"
            >
              {menuOpen ? (
                <IoMdClose className="h-6 w-6 text-white" />
              ) : (
                <AiOutlineMenu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "block px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-gray-100"
                    : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile auth buttons */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    window.location.href = "/login";
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/registration-choice";
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
