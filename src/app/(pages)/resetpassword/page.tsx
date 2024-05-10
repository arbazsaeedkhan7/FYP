"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(""); // State to store the reset token from URL

  // Get reset token from URL query parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");
    if (resetToken) {
      setToken(resetToken);
      console.log("Reset token extracted:", resetToken); // Log the extracted reset token
    } else {
      console.log("No reset token found in URL"); // Log if no reset token found
      router.push("/forgotpassword"); // Redirect to forgot password page if no token found
    }
  }, []);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Form submitted with token:", token); // Log the reset token included in the form submission
  
      const { data } = await axios.post("/api/users/resetpassword", {
        password,
        confirmPassword,
        token, // Include the reset token in the request body
      });
  
      toast.success(data.message);
      router.push("/login"); // Redirect to login page after successful reset
    } catch (error: any) {
      console.error("Reset password failed", error.response?.data.error || error.message);
      toast.error(error.response?.data.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Function to handle password input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Function to handle form submission
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  
  //     const { data } = await axios.post("/api/users/resetpassword", {
  //       password,
  //       confirmPassword,
  //       token, // Include the reset token in the request body
  //     });
  
  //     toast.success(data.message);
  //     router.push("/login"); // Redirect to login page after successful reset
  //   } catch (error: any) {
  //     console.error("Reset password failed", error.response?.data.error || error.message);
  //     toast.error(error.response?.data.error || error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
      <h1 className="text-white text-3xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="New Password"
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 mb-4 text-white bg-green-700 rounded hover:bg-green-500 focus:outline-none"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
