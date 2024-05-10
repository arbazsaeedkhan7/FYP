// LogoutPage.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const LogoutPage: React.FC = () => {
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
    };

    // You might want to call the logout function automatically when this page loads
    React.useEffect(() => {
        logout();
    }, []);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default LogoutPage;
