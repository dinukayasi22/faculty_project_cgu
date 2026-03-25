import React from "react";
import { footerImages } from "../assets/images/assets";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-auto">
      <div className="px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
        <img
          src={footerImages.LogoFooter}
          alt="LOGO"
          className="w-10 h-10 object-cover rounded-full"
        />
        <p>
          {" "}
          Copyright &copy; {new Date().getFullYear()} Career Guidance Unit,
          Rajarata University of Sri Lanka. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
