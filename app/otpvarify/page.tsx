"use client";

import { otpvaarify } from "@/api/servierce/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

 const OtpVerify = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      toast.error("No email found. Please sign up first.");
      router.push("/signup");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { otp, email };

    try {
      const response = await otpvaarify(credentials);

      toast.success(response.message || "OTP verified successfully!");
      if (response.Token) {
        localStorage.setItem("token", response.Token);
        router.push("/");
      }
    } catch (error: any) {
      console.error("OTP Error:", error); // Debugging Line
      toast.error(error.response?.data?.message || "OTP verification failed!");
    }
  };

  return (
    <div>
      <form onSubmit={verifyOtp}> 
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email
        </label>
        <p className="w-full px-4 py-2 border rounded-lg bg-gray-100">{email}</p> 
        
        <label htmlFor="otp" className="block text-sm font-medium text-gray-600 mt-2">
          OTP
        </label>
        <input
          type="text"
          id="otp"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Verify
        </button>
      </form>
    </div>
  );
};
export default OtpVerify;