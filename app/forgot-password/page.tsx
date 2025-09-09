"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Mail, KeyRound } from "lucide-react";
import { forgotPassword, verifyForgotPasswordOtp } from "@/api/servierce/auth";
import CustomInput from "@/app/components/custominput";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!showOtpInput) {
        await forgotPassword(email);
        setShowOtpInput(true);
        toast.success("OTP sent to your email!");
      } else {
        const response = await verifyForgotPasswordOtp({ email, otp });
        if (response.status === 1) {
          router.push(`/change-password?email=${email}&otp=${otp}`);
        } else {
          toast.error(response?.message || "invalid OTP");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {showOtpInput
            ? "Step 2: Enter the OTP sent to your email"
            : "Step 1: Enter your registered email"}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <CustomInput
            label="Email Address"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            disabled={showOtpInput}
          />
          {showOtpInput && (
            <CustomInput
              label="OTP"
              type="number"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              leftIcon={
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              }
            />
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : showOtpInput ? (
              "Verify OTP"
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
