import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
<footer className="text-white py-8">
  <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
    {/* Company Information */}
    <div className="mb-4 md:mb-0">
      <h4 className="text-xl font-bold mb-2">Company Name</h4>
      <p className="text-gray-500">Address, City, Country</p>
      <p className="text-gray-500">Phone: +123 456 789</p>
      <p className="text-gray-500">Email: info@example.com</p>
    </div>

    {/* Quick Links */}
    <div className="flex flex-wrap">
      <div className="mr-6 mb-4">
        <h4 className="text-lg font-bold mb-2">Quick Links</h4>
        <ul className="list-none">
          <li><a href="#">Home</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      {/* Social Media Icons */}
      <div>
        <h4 className="text-lg font-bold mb-2">Follow Us</h4>
        <div className="flex space-x-4">
          {/* Add your social media icons or use FontAwesome or other icon libraries */}
          <a href="#" className="text-white"><i className="fab fa-facebook"></i></a>
          <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-white"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>
  </div>
</footer>
    );
};
export default Navbar;