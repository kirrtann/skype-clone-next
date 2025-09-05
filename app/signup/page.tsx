"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "@/api/servierce/auth";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Calendar, Lock } from "lucide-react";
import CustomInput from "@/components/custominput";
import validateFields from "@/components/forminputerror";

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  birth_date?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birth_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id as keyof ValidationErrors]) {
      setErrors({ ...errors, [e.target.id]: undefined });
    }
  };

  const validateRegisterForm = (): boolean => {
    const errors = validateFields(formData, [
      "email",
      "password",
      "name",
      "birth_date",
    ]);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        birth_date: new Date(formData.birth_date),
      };

      const response = await signup(credentials);
      localStorage.setItem("email", credentials.email);
      toast.success(response.message || "Signup successful!");
      if (response.status === 1) {
        router.push("/otpvarify");
      } else toast.error(response?.message || "Sing UP Filed");
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />

      <div className="w-full max-w-md text-black">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <CustomInput
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter Your Name"
                leftIcon={
                  <User
                    className={`h-5 w-5 ${
                      errors.name ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                }
                error={errors.name}
              />
            </div>
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                }
                error={errors.password}
              />
            </div>
            <div className="space-y-2">
              <CustomInput
                label="Date Of Birth"
                type="date"
                id="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                error={errors.birth_date}
                leftIcon={
                  <Calendar
                    className={`h-5 w-5 ${
                      errors.birth_date ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
