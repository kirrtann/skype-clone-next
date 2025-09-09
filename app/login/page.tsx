"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { login } from "@/api/servierce/auth";
import Link from "next/link";
import useUser from "../zustand/useUser";
import CustomInput from "@/app/components/custominput";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  useEffect(() => {
    if (user?.token) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(formData);

      if (response?.status === 1) {
        const user = {
          id: response?.data?.id,
          name: response?.data?.name,
          token: response?.data?.token,
        };
        console.log(user);

        setUser(user);
        localStorage.setItem("name", user.name || "");
        localStorage.setItem("token", user.token);
        localStorage.setItem("UserId", user.id);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response?.message || "Login failed - invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your Chat account</p>
        </div>

        <div className="bg-white shadow-xl text-black rounded-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <CustomInput
              label="Email Address"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email}
            />

            <CustomInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={
                <button type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              }
              error={errors.password}
            />
            <div className="flex justify-end">
              <Link
                href="forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to Chat?
                </span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
