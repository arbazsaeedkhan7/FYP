"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGetStartedClick = () => {
    // Set loading state to true when button is clicked
    setIsLoading(true);

    // Simulate an asynchronous action (e.g., API call)
    setTimeout(() => {
      // After a delay, navigate to the signup page
      router.push('/signup');
      
      // Reset loading state to false
      setIsLoading(false);
    }, 2000); // Adjust delay as needed
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {/* Hero Section */}
      <header className="bg-slate-900 py-24">
        <div className="container mx-auto flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4" style={{ cursor: 'default' }}>
              Connect with Top Employers
            </h1>
            <p className="text-lg text-gray-300 mb-8" style={{ cursor: 'default' }}>
              Find Your Dream Driving Job.
            </p>
            <Link href="">
              <button
                className="mr-2 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Home
              </button>
            </Link>
            {/* Add loading indicator and disable button when loading */}
            <button
              onClick={handleGetStartedClick}
              className={`bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Started Now'}
            </button>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="bg-slate-800 mx-auto px-10 py-20">
        <div className="flex flex-wrap justify-center items-center">
          <div className="w-full md:w-1/3 p-4">
            <i className="fas fa-truck-moving text-4xl text-blue-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ cursor: 'default' }}>
              Find High-Paying Jobs
            </h3>
            <p className="text-gray-300" style={{ cursor: 'default' }}>
              Access a wide variety of driving jobs with competitive pay and benefits.
            </p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <i className="fas fa-handshake text-4xl text-blue-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ cursor: 'default' }}>
              Connect with Top Employers
            </h3>
            <p className="text-gray-300" style={{ cursor: 'default' }}>
              Get noticed by reputable transportation companies looking for qualified drivers.
            </p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <i className="fas fa-briefcase text-4xl text-blue-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ cursor: 'default' }}>
              Manage Your Career
            </h3>
            <p className="text-gray-300" style={{ cursor: 'default' }}>
              Create a professional profile, track your applications, and receive job alerts.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
