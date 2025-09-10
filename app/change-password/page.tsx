"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "@/api/servierce/auth";
import { type FC } from "react";
import CustomInput from "@/app/components/custominput";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Invalid request");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        email,
        newPassword: passwords.newPassword,
      });
      if (response.status === 1) {
        toast.success("Password changed successfully!");
        router.push("/login");
      } else {
        toast.error(response.message || "Password not change");
      }
    } catch (error) {
      console.error("Failed to change password. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Change Password
        </h2>
        <form className="space-y-4 text-black" onSubmit={handleSubmit}>
          <CustomInput
            label=" New Password"
            name="password"
            value={passwords.newPassword}
            onChange={handleChange}
            id="newPassword"
            type="password"
            placeholder="Enter new password"
          />

          <CustomInput
            label=" Confirm Password"
            name="password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
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
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
