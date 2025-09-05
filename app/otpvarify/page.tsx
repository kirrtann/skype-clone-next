"use client";

import { otpvaarify } from "@/api/servierce/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Shield, RefreshCw, CheckCircle } from "lucide-react";

const OTP_LENGTH = 6;

const OtpVerify = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      toast.error("No email found. Please sign up first.");
      router.push("/signup");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetOtp = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === OTP_LENGTH) {
      setOtp(pastedData.split(""));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      toast.error("Please enter a valid OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await otpvaarify({ otp: otpString, email });
      if (response === 1) {
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.message || "OTP verification failed!");
      resetOtp();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      toast.success("OTP has been resent to your email");
      setTimeLeft(30);
      resetOtp();
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(Boolean);
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="light"
        className="mt-16"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We&apos;ve sent a verification code to your email address
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8">
          <div className="mb-6 flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">{maskedEmail}</span>
          </div>

          <form onSubmit={verifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoComplete="off"
                    className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isOtpComplete}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isLoading || !isOtpComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verify Code
                </div>
              )}
            </button>
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timeLeft > 0 || isResending}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  timeLeft > 0 || isResending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
                />
                {timeLeft > 0
                  ? `Resend in ${timeLeft}s`
                  : isResending
                  ? "Sending..."
                  : "Resend Code"}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-400-600 hover:text-gray-800 text-sm transition-colors duration-200"
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
