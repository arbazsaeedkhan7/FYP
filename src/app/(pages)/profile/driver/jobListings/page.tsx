"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/Navbar';
import { jwtDecode } from 'jwt-decode';

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

export default function JobListingsPage() {
  const router = useRouter();
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [filteredJobListings, setFilteredJobListings] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get('/api/jobs/listings');
        setJobListings(response.data.jobListings);
        setFilteredJobListings(response.data.jobListings);
        const allLocations = response.data.jobListings.map((job: Job) => job.location);
        const uniqueLocations = Array.from(new Set(allLocations)) as string[];
        setLocations(uniqueLocations);

      } catch (error) {
        console.error('Error fetching job listings:', error);
        toast.error('Failed to fetch job listings');
      }
    };

    fetchJobListings();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
        const tokenCookie = document.cookie.split(';').find((row) => row.trim().startsWith('token='));
        let email = '';
        if (tokenCookie) {
            const tokenValue = tokenCookie.split('=')[1];
            const decodedToken: any = jwtDecode(tokenValue);
            email = decodedToken.email;
        } else {
          console.error('Token cookie not found');
        }
        
        const response = await axios.put('/api/jobs/posts', { jobId, email });
        console.log(response.data.message);
        
        // Check if the application was successfully submitted
        if (response.data.message === 'Job application submitted successfully') {
          toast.success('Job application submitted successfully');
        } else {
          // Display a different message for duplicate applications
          toast.info('You have already applied for this job');
        }
    
    } 
    
    catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit job application');
    }
  };

  const openDetailsModal = (job: Job) => {
    setSelectedJob(job);
  };

  const closeDetailsModal = () => {
    setSelectedJob(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleCloseModalOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeDetailsModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseModalOutside);
    return () => {
      document.removeEventListener('mousedown', handleCloseModalOutside);
    };
  }, []);

  const applyFilters = () => {
    let filteredListings = jobListings;

    if (selectedLocations.length > 0) {
      filteredListings = filteredListings.filter(job => selectedLocations.includes(job.location));
    }

    if (minSalary !== '') {
      filteredListings = filteredListings.filter(job => job.salary >= parseInt(minSalary));
    }

    if (maxSalary !== '') {
      filteredListings = filteredListings.filter(job => job.salary <= parseInt(maxSalary));
    }

    setFilteredJobListings(filteredListings);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedLocations, minSalary, maxSalary]);

  useEffect(() => {
    // Apply search filter when search term changes
    const filtered = jobListings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobListings(filtered);
  }, [searchTerm, jobListings]);

  const sortByDeadline = () => {
    const sortedListings = [...filteredJobListings].sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
    setFilteredJobListings(sortedListings);
  };

  const sortByApplicants = () => {
    const sortedListings = [...filteredJobListings].sort((a, b) => b.applicants.length - a.applicants.length);
    setFilteredJobListings(sortedListings);
  };

  const sortBySalary = () => {
    const sortedListings = [...filteredJobListings].sort((a, b) => a.salary - b.salary);
    setFilteredJobListings(sortedListings);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case 'deadline':
        sortByDeadline();
        break;
      case 'applicants':
        sortByApplicants();
        break;
      case 'salary':
        sortBySalary();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <div className="mx-auto min-h-screen bg-slate-800 p-4">
        <h1 className="py-2 text-3xl font-semibold mb-6 text-center text-white">Job Listings</h1>
        <div className="flex justify-end mb-4 ">
          <button
            onClick={toggleFilters}
            className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-500 focus:outline-none mr-7"
          >
            {filtersOpen ? 'Close Filters' : 'Open Filters'}
          </button>
          <button
            onClick={() => handleSort('deadline')}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-500 focus:outline-none mr-3"
          >
            Sort by Deadline
          </button>
          <button
            onClick={() => handleSort('applicants')}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-500 focus:outline-none mr-3"
          >
            Sort by Applicants
          </button>
          <button
            onClick={() => handleSort('salary')}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-500 focus:outline-none mr-3"
          >
            Sort by Salary
          </button>
        </div>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 mb-4 bg-white rounded-md shadow-md mx-auto text-black"
        />
        
        {filtersOpen && (
          <div className="col-span-1 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Filter by Location:</h2>
              <div className="flex flex-wrap">
                {locations.map(location => (
                  <label key={location} className="inline-flex items-center mr-4 mb-2">
                    <input
                      type="checkbox"
                      value={location}
                      checked={selectedLocations.includes(location)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedLocations(prevState => {
                          if (prevState.includes(value)) {
                            return prevState.filter(item => item !== value);
                          } else {
                            return [...prevState, value];
                          }
                        });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-800">{location}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Filter by Salary:</h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Min Salary"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="text-black w-1/2 px-4 py-2 mb-2 mr-2 border rounded focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Max Salary"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="text-black w-1/2 px-4 py-2 mb-2 border rounded focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-6">
          {filteredJobListings.length > 0 ? (
            filteredJobListings.map((job) => (
              <div key={job._id} className="flex flex-col w-full">
                <div className="bg-black shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform mb-4">
                  <div className="px-6 py-4">
                    <h2 className="text-l mb-2 text-white truncate">{job.title}</h2>
                    <br />
                    <p className="text-white font-bold mb-2">Location: {job.location}</p>
                    <p className="text-white font-bold mb-2">Salary: Rs. {job.salary}</p>
                    <p className="text-white font-bold mb-2">Deadline: {new Date(job.applicationDeadline).toLocaleString()}</p>
                    <p className="text-white font-bold mb-2">Applicants: {job.applicants.length}</p>
                  </div>
                  <div className="px-6 py-4 bg-slate text-center">
                    <button
                      onClick={() => openDetailsModal(job)}
                      className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 focus:outline-none"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No job listings match the selected filters.</p>
          )}
        </div>
        <ToastContainer />
  
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900 bg-opacity-90 overflow-auto">
            <div ref={modalRef} className="relative bg-white p-6 rounded-lg shadow-md max-w-screen-lg flex flex-col w-full">
              <button 
                className="p-3 text-gray-800 font-bold transition-all duration-300 transform hover:scale-110 hover:text-gray-900 absolute top-2 right-2" 
                onClick={closeDetailsModal}
              >
                Close
              </button>
              <h2 className="text-2xl font-semibold mb-4">{selectedJob.title}</h2>
              <div className="text-gray-600 mb-4 flex flex-col">
                <p className="mb-2">
                  <strong>Description:</strong>
                </p> 
                <p className="w-full break-words whitespace-normal">{selectedJob.description}</p>
              </div>
              <div className="text-gray-600 mb-4 flex flex-col">
                <p className="mb-2">
                  <strong>Requirements:</strong>
                </p>
                <p className="w-full break-words whitespace-normal">{selectedJob.requirements}</p>
              </div>
              <p className="text-gray-600 mb-4">Location: {selectedJob.location}</p>
              <p className="text-gray-600 mb-4">Salary: Rs.{selectedJob.salary}</p>
              <p className="text-gray-600 mb-4">Deadline: {new Date(selectedJob.applicationDeadline).toLocaleString()}</p>
              <button
                onClick={() => handleApply(selectedJob._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none self-center"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
