"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import storage from "@/firebaseConfig/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        contactNumber: "",
        cvFile: null as File | null,
        role: "driver",
        cvUrl: "",
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "cvFile") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files && fileInput.files[0];
            setFormData({ ...formData, cvFile: file });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Check if cvFile is present
            if (formData.cvFile) {
                const cvRef = ref(storage, `cv/${formData.email}.pdf`);
                const snapshot = await uploadBytesResumable(cvRef, formData.cvFile);
                const cvUrl = await getDownloadURL(ref(storage, `cv/${formData.email}.pdf`)); // Retrieve download URL
            
                console.log("cvUrl after retrieval:", cvUrl);
            
                const updatedFormData = { ...formData, cvUrl }; // Create a new object with updated cvUrl
                setFormData(updatedFormData); // Update formData with updatedFormData
            }
            
    
            // Remove cvFile from formData before sending it to the backend
            const { cvFile, ...formDataWithoutCV } = formData;

            
            // Ensure cvUrl is included in the data sent to the backend
            const dataToSend = { ...formDataWithoutCV, cvUrl: formData.cvUrl };
            console.log("Data to send:", dataToSend); // Add this log to verify dataToSend

            await axios.post("/api/users/signup", dataToSend);
            toast.success("Signup successful! Redirecting to login page..");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error:any) {
            console.error("Signup failed", error.response?.data.error || error.message);
            toast.error(error.response?.data.error || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
            <button onClick={handleBack} className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 className="text-white text-3xl font-bold mb-4">{loading ? "Processing" : "Signup"}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
            <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none"
                    required
                />
                <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none"
                    required
                />
                <div className="mb-4">
                    <label className="text-gray-700 mr-4">
                        <input
                            type="radio"
                            name="role"
                            value="driver"
                            checked={formData.role === "driver"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Driver
                    </label>
                    <label className="text-gray-700">
                        <input
                            type="radio"
                            name="role"
                            value="employer"
                            checked={formData.role === "employer"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Employer
                    </label>
                </div>
                {formData.role === 'driver' && (
                    <input
                        type="file"
                        name="cvFile"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none"
                        required
                    />
                )}
                <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-500 focus:outline-none">
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            <p className="mt-4 text-white">
                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
            </p>
            <ToastContainer />
        </div>
    );
}
