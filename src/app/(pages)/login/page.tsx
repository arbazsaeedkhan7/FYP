"use client";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode'; // Import jwt_decode to decode JWT token

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", formData);
      toast.success("Login successful");

      // Extract token from cookies and decode to get email
      const token = response.data.token;
      //decode the token
      const decodedToken: any = jwtDecode(token);
      toast.success("Welcome " + decodedToken.email);

      // Redirect based on user role
      if (decodedToken.role === 'driver') {
        router.push("/profile/driver");
      } else if (decodedToken.role === 'employer') {
        router.push("/profile/employer");
      }
    } catch (error: any) {
      console.error("Login failed", error.response?.data.error || error.message);
      toast.error(error.response?.data.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/"); // Navigate back to the previous page
  };

  // Function to get cookie value by name
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return ''; // Return empty string if cookie not found
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
      <button onClick={handleBack} className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 className="text-white mb-4 text-3xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 mb-4 text-white bg-green-700 rounded hover:bg-green-500 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="mt-4 text-white">
        Forgot Password? <a href="/forgotpassword" className="text-blue-500 hover:underline">Click here to reset.</a>
      </p>
      <p className="text-white">
        Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
      </p>
      <ToastContainer />
    </div>
  );
}
