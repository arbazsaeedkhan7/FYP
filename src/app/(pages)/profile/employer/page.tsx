"use client";
// /profile/employer/page.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import { jwtDecode } from "jwt-decode";

export default function EmployerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = document.cookie.split(';').find(row => row.startsWith('token'));
        if (!token) {
          console.error("Token not found in cookie");
          router.push("/login");
          return;
        }
        const tokenValue = token.split('=')[1];
        const decodedToken: any = jwtDecode(tokenValue);

        const response = await axios.post("/api/users/profile", { decodedToken });
        setUser(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to fetch user data");
        setLoading(false);

        if (error.response?.status === 401 || error.response?.status === 404) {
          router.push("/login");
        }
      }
    };

    fetchData();
  }, [router]);

  const handleEdit = (field: string) => {
    setEditField(field);
    setEditValue(user.profile[field]);
  };

  const handleCancelEdit = () => {
    setEditField(null);
    setEditValue("");
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const token = document.cookie.split(';').find(row => row.startsWith('token'));
      if (!token) {
        console.error("Token not found in cookie");
        router.push("/login");
        return;
      }
      const tokenValue = token.split('=')[1];
      const decodedToken: any = jwtDecode(tokenValue);

      const response = await axios.post("/api/users/update", { field: editField, value: editValue, decodedToken });
      setUser(response.data.user);
      setEditField(null);
      setEditValue("");
      setLoading(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
    <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
    <div className={`mx-auto min-h-screen  bg-slate-800  shadow-md `}>
      <h1 className="pt-4 text-3xl font-semibold mb-6 text-center text-white">Welcome back!</h1>
      {loading ? (
        <p className="text-center text-white">Loading user data...</p>
      ) : user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Full Name:</label>
              <span className="ml-2 text-gray-100">{user.fullName}</span>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Email:</label>
              <span className="ml-2 text-gray-100">{user.email}</span>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Contact Number:</label>
              <span className="ml-2 text-gray-100">{user.contactNumber}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('contactNumber')}>Edit</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Location:</label>
              <span className="ml-2 text-gray-100">{user.profile.location}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('location')}>Edit</button>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Bio:</label>
              <span className="ml-2 text-gray-100">{user.profile.bio}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('bio')}>Edit</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Company Name:</label>
              <span className="ml-2 text-gray-100">{user.profile.companyName}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('companyName')}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-white">Failed to load user data.</p>
      )}
      {/* Edit Form */}
      {editField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Edit {editField}</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
    </div>
  );
}
