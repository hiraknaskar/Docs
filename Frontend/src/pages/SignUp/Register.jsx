import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance"; // Import axiosInstance
import Passwordinput from "../../Components/imput/Passwordinput"; // Fix typo in the import path if necessary

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: fullName, // Corrected 'name' to 'fullName'
                email: email,
                password: password,
            });

            if (response.data.error) {
                setError(response.data.message);
            } else if (response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken); 
                navigate("/dashbord");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMsg);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-zinc-700 text-white"> {/* Dark background */}
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300"> {/* Light text */}
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <Passwordinput 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300">Already have an account?</p> {/* Lighter text */}
                    <button
                        onClick={handleLoginRedirect}
                        className="mt-2 text-indigo-600 hover:underline"
                    >
                        Login Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
