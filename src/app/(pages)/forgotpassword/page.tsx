"use client";
// Import necessary modules
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

// Functional component for Forgot Password Page
export default function ForgotPasswordPage() {
    const router = useRouter(); // Initializing useRouter hook for navigation
    const [email, setEmail] = useState(""); // State to store email input value
    const [loading, setLoading] = useState(false); // State to manage loading indicator

    // Function to handle email input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true); // Set loading state to true to indicate processing
            await axios.post("/api/users/forgotpassword", { email }); // Make POST request to forgotPassword API endpoint
            toast.success("Password reset instructions sent to your email."); // Show success toast notification
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            console.error("Forgot password failed", error.response?.data.error || error.message); // Log error message
            toast.error(error.response?.data.error || error.message); // Show error toast notification
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // JSX code for rendering the Forgot Password form
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
            <h1 className="text-white text-3xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 mb-4 text-white bg-green-700 rounded hover:bg-green-500 focus:outline-none"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Reset Instructions"}
                </button>
            </form>
            <ToastContainer /> {/* ToastContainer component for displaying toast notifications */}
        </div>
    );
}
