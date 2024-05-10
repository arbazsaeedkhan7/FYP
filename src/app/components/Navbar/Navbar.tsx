import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    // Set loading state to true when button is clicked
    setIsLoading(true);

    // Simulate an asynchronous action (e.g., API call)
    setTimeout(() => {
      // After a delay, navigate to the login page
      router.push('/login');
      
      // Reset loading state to false
      setIsLoading(false);
    }, 2000); // Adjust delay as needed
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <div className="flex items-center">
            {/* Logo Image */}
            <Image
              src="/logo.svg" 
              alt="DriverConnect Logo"
              width={50} 
              height={50}
            />
            <span className="ml-3 text-xl text-white" style={{ cursor: "default" }}>DriverConnect</span>
          </div>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400   flex flex-wrap items-center text-base justify-center">
          <Link href="" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            Home
          </Link>
          <Link href="/about" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            About Us
          </Link>
          <Link href="/contact" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            Contact
          </Link>
          <Link href="" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            Jobs
          </Link>
        </nav>
        {/* Add loading indicator and disable button when loading */}
        <button
          onClick={handleLoginClick}
          className={`inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : (
            <>
              Login
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
