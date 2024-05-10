"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import { jwtDecode } from "jwt-decode";

export default function DriverProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

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

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = document.cookie.split(';').find(row => row.startsWith('token'));
      if (!token) {
        console.error("Token not found in cookie");
        router.push("/login");
        return;
      }
      const tokenValue = token.split('=')[1];
      
      const response = await axios.post("/api/users/update", { field: editField, value: editValue, decodedToken: jwtDecode(tokenValue) });
      setUser(response.data.user);
      toast.success(response.data.message);
      setEditField("");
      setEditValue("");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <div className="mx-auto min-h-screen  bg-slate-800  shadow-md p-4">
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
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('contactNumber', user.contactNumber)}>Edit</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Location:</label>
              <span className="ml-2 text-gray-100">{user.profile.location}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('location', user.profile.location)}>Edit</button>
              </div>
            </div>
            
          </div>
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Bio:</label>
              <span className="ml-2 text-gray-100">{user.profile.bio}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('bio', user.profile.bio)}>Edit</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-300">Experience:</label>
              <span className="ml-2 text-gray-100">{user.profile.experience}</span>
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-700 focus:outline-none" onClick={() => handleEdit('experience', user.profile.experience)}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-white">Failed to load user data.</p>
      )}

      {/* Edit Form */}
      {editField && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90 flex justify-center items-center z-50">
          <div className="text-black bg-white p-6 rounded-md">
            <label className="block mb-2 text-gray-800">{editField.charAt(0).toUpperCase() + editField.slice(1)}:</label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none"
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 mr-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none" onClick={handleSave}>Save</button>
              <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none" onClick={() => setEditField("")}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
    </div>
  );
}



// export async function POST(request: NextRequest) {
//     try {
//       const { token } = await request.json(); // Extract email from request body
//       console.log("Access token received:", token); // Log the received email
  
//       // Verify access token using jsonwebtoken
//       // const decoded = jwt.verify(email, process.env.tokenSecret!); // Replace with your JWT secret
//       // if (!decoded) {
//       //   console.error("Invalid access token");
//       //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       // }
  
//       // const userId = (decoded as JwtPayload).userId; // Extract user ID from decoded token
  
//       // Fetch user profile data from the database by email
//       const user = await User.findOne(token); // Find user by email
//       console.log("User profile data:", user); // Log user profile data
  
//       if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 }); // Return error if user not found
//       }
  
//       // Ensure user is an employer
//       if (user.role !== 'employer') {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Return error if user is not an employer
//       }
  
//       // Return success response with user profile data
//       return NextResponse.json({
//         fullName: user.fullName,
//         email: user.email,
//         contactNumber: user.contactNumber,
//         profile: {
//           location: user.profile.location,
//           bio: user.profile.bio,
//           experience: user.profile.experience,
//           // Add other profile fields as needed
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching employer profile:", error); // Log error
//       return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Return error response
//     }
//   }
  