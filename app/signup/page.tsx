"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "@/api/servierce/auth";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birth_date: "",
    otp: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        birth_date: new Date(formData.birth_date)
      };

      const response = await signup(credentials);
      localStorage.setItem("token", response.data.token);
      toast.success(response.message || "Signup successful!");

      setTimeout(() => {
        router.push("/"); 
      }, 1000);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer /> 
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" required />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your name" required />
          </div>
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-600">Birthday</label>
            <input type="date" id="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
