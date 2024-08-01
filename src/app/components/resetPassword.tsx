"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PasswordService from "@/services/passwordService";

export default function ResetPassword({ params }: any) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const userData = await PasswordService.verifyToken(params.token);
        setUser(userData);
        setVerified(true);
      } catch (error: any) {
        setError(error.message);
        setVerified(false);
      }
    };
    verifyToken();
  }, [params.token, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const password = (e.target as any)[0].value;
    const confirmPassword = (e.target as any)[1].value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await PasswordService.resetPassword(password, user?.email);
      toast.success("Password reset successfully");
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  };

  if (!verified) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="shadow-lg p-6 rounded-lg border-t-4 bg-orange-200">
          <h1 className="text-xl font-bold my-4">Reset Password</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid place-items-center h-screen bg-gray-200">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-white">
        <h1 className="text-xl font-bold my-4 text-black">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New Password"
            required
            className="placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            required
            className="placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md"
          />
          <button className="bg-blue-500 hover:to-blue-400 rounded-lg text-white font-bold px-6 py-2">
            Reset Password
          </button>
          {error && (
            <div className="text-red-500 w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
