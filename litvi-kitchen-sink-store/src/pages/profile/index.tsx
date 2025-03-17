import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Index = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const navigate = useNavigate();
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500 font-medium animate-pulse">
                    Please log in to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-2xl mx-auto pt-5">
                    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-20">
                        {/* Profile Header */}
                        <div className="bg-litvi-purple p-6 text-center ">
                            <div className="inline-block relative">
                                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                                    <span className="text-3xl text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h1 className="mt-4 text-2xl font-bold text-white">
                                {user.username}
                            </h1>
                            <p className="text-gray-200">{user.email}</p>
                        </div>

                        {/* Profile Details */}
                        <div className="p-6 space-y-6 bg-gray-800">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-700 rounded-lg">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Full Name</p>
                                        <p className="font-medium text-gray-200">{user.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-700 rounded-lg">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email Address</p>
                                        <p className="font-medium break-all text-gray-200">{user.email}</p>
                                    </div>
                                </div>

                               
                            </div>

                            <button
                                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    navigate('/');
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Index;
