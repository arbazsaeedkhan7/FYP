"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/Navbar';
import { jwtDecode } from 'jwt-decode';
import storage from '@/firebaseConfig/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: number;
  applicationDeadline: string;
  applicants: string[];
}

interface Application {
  _id: string;
  jobId: string;
  email: string;
}

export default function ViewApplicationsPage() {
  const router = useRouter();
  const [jobPosts, setJobPosts] = useState<Job[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        // Get employer email from token
        const tokenCookie = document.cookie.split(';').find((row) => row.trim().startsWith('token='));
        if (!tokenCookie) {
          return console.error('Token cookie not found');
        }
        const tokenValue = tokenCookie.split('=')[1];
        const decodedToken: any = jwtDecode(tokenValue);
        const employerEmail = decodedToken.email;

        // Fetch job posts created by the employer
        const response = await axios.post('/api/jobs/applications', { employerEmail });
        setJobPosts(response.data.jobPosts);
      } catch (error) {
        console.error('Error fetching job posts:', error);
        toast.error('Failed to fetch job posts');
      }
    };

    fetchJobPosts();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleViewApplicants = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleCloseApplicants = () => {
    setSelectedJob(null);
  };

  const downloadCV = async (applicantEmail: string) => {
    try {
      // Use the applicant's email to construct the CV file name
      const cvFileName = `${applicantEmail}.pdf`; // Change the file extension based on the actual format of CV files

      // Construct the reference to the CV file in Firebase Storage
      const cvRef = ref(storage, `cv/${cvFileName}`);

      // Get the download URL for the CV file
      const cvUrl = await getDownloadURL(cvRef);

      // Open the CV file in a new tab for download
      window.open(cvUrl, "_blank");
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV");
    }
  };

  return (
    <div>
      <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <div className="mx-auto min-h-screen bg-slate-800 p-4">
        <h1 className="py-2 text-3xl font-semibold mb-6 text-center text-white">View Applications</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-6">
          {jobPosts.map((job) => (
            <div key={job._id} className="flex flex-col w-full">
              <div className="bg-white rounded-lg shadow p-4 mb-4 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">{job.title}</h2>
                  <p className="text-gray-600 mb-2">Location: {job.location}</p>
                  <p className="text-gray-600 mb-2">Salary: Rs. {job.salary}</p>
                  <p className="text-gray-600 mb-2">Deadline: {new Date(job.applicationDeadline).toLocaleString()}</p>
                  <p className="text-gray-600 mb-2">Applicants: {job.applicants.length}</p>
                </div>
                <button
                  onClick={() => handleViewApplicants(job._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 overflow-auto">
          <div className="relative bg-white p-6 rounded-lg shadow-md max-w-screen-lg flex flex-col w-full">
            <button 
              className="p-3 text-gray-800 font-bold transition-all duration-300 transform hover:scale-110 hover:text-gray-900 absolute top-2 right-2" 
              onClick={handleCloseApplicants}
            >
              Close
            </button>
            <h2 className="text-2xl font-semibold mb-4">Applicants for {jobPosts.find(job => job._id === selectedJob)?.title}</h2>
            <div className="text-gray-600 mb-4 flex flex-col">
              {jobPosts.find(job => job._id === selectedJob)?.applicants.map((applicant, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <p className="mb-0">{applicant}</p>
                  <button
                    onClick={() => downloadCV(applicant)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
                  >
                    Download CV
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
