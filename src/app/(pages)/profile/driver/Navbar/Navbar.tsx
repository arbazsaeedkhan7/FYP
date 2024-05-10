import React from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Navbar = ({ menuOpen, toggleMenu }: { menuOpen: boolean; toggleMenu: () => void; }) => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      localStorage.removeItem('token');
      toast.success('Logout successful');
      router.push('/');
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
      <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center">
        <header className="ml-3 text-xl text-white" style={{ cursor: "default" }}>DriverConnect</header>
        
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400   flex flex-wrap items-center text-base justify-center">
          <Link href="/profile/driver" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            My Profile
          </Link>
          <Link href="/profile/driver/jobListings" className="mr-5 hover:text-gray-700 text-gray-300" style={{ cursor: "pointer" }}>
            Job Listings
          </Link>
          
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium focus:outline-none" onClick={logout}>
            Logout
          </button>
        </nav>
        
          
      </div>
  );
};

export default Navbar;
