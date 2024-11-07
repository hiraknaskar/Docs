import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Passwordinput from "../../Components/imput/Passwordinput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email.");
            return;
        }

        if (!password) {
            setError("Please enter a valid password.");
            return;
        }

        setError("");
        
        try {
            // Perform login API call
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password,
            });

            // Check if response includes the token
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken); // Store the token in localStorage
                console.log("Token stored:", response.data.accessToken);
                navigate("/dashbord");
            } else {
                setError("Login failed. No token received.");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-zinc-700 text-white"> {/* Updated background color */}
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <form onSubmit={handleLogin}>
                    <h4 className="text-2xl font-semibold text-center mb-6">Login</h4>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300"> {/* Updated text color */}
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-800 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Updated input box color
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <Passwordinput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300">Not registered yet?</p> {/* Updated text color */}
                    <Link to="/register" className="mt-2 text-indigo-600 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
