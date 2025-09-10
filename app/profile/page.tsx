"use client";

import { logout } from "@/api/servierce/auth";
import { getprofile } from "@/api/servierce/user";
import { useEffect, useState } from "react";

interface IUser {
  id: string;
  name: string;
  email: string;
  birth_date: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await getprofile();
      setProfileData(response?.data || null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlelogout = async () => {
    const response = await logout();
    if (response.status === 1) {
      localStorage.clear();
      window.location.reload();
    } else {
      console.warn("Not Logout ");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {profileData.name?.charAt(0)}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-gray-800">
            {profileData.name}
          </h2>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500">
              Email:
              <span className="text-gray-700"> {profileData.email}</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-blue-500">
              Date Of Birth:
              <span className="text-gray-700">
                {profileData.birth_date.toString()}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex  justify-between">
          <button className="bg-blue-500 text-white py-1 px-4 rounded-md shadow hover:bg-blue-600 transition">
            Reset Password
          </button>
          <button
            className="bg-red-500 text-white py-1 px-4 rounded-md shadow hover:bg-red-600 transition"
            onClick={() => handlelogout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
