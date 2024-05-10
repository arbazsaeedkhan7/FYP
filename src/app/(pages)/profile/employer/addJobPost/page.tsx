"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';

export default function AddJobPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    applicationDeadline: '', // Added applicationDeadline field
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const token = document.cookie.split(';').find((row) => row.startsWith('token'));
      if (!token) {
        console.error('Token not found in cookie');
        router.push('/login');
        return;
      }
      const tokenValue = token.split('=')[1];
      const decodedToken :any = jwtDecode(tokenValue);
      const email = decodedToken.email;
      
      const createdAt = new Date().toISOString();
      const response = await axios.post('/api/jobs/posts', { ...formData, employer: email, createdAt });
      console.log('Job post created:', response.data);
      toast.success('Job post created successfully');
      router.push('/profile/employer');
    } catch (error) {
      console.error('Error creating job post:', error);
      toast.error('Failed to create job post');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
    <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
    <div className="mx-auto min-h-screen bg-slate-800 shadow-md">
      <h1 className="pt-4 text-3xl font-semibold mb-6 text-center text-white">Add New Job</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label htmlFor="title" className="block text-gray-300 font-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-gray-300 font-semibold">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-300 font-semibold">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            >
              <option value="">Select Location</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Multan">Multan</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Quetta">Quetta</option>
              <option value="Gujranwala">Gujranwala</option>
              <option value="Sialkot">Sialkot</option>
              <option value="Bahawalpur">Bahawalpur</option>
              <option value="Sargodha">Sargodha</option>
              <option value="Abbotabad">Abbotabad</option>
              <option value="Mardan">Mardan</option>
              
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="block text-gray-300 font-semibold">
              Salary
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="applicationDeadline" className="block text-gray-300 font-semibold">
              Application Deadline
            </label>
            <input
              type="datetime-local" // Use appropriate type for date and time
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            />
          </div>

          {/* Add createdAt field */}
          <input type="hidden" name="createdAt" value={new Date().toISOString()} />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}
