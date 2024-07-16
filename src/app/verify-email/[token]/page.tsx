"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = getTokenFromPathname();
      if (token) {
        await verifyEmail(token);
      }
    };
    verifyEmailToken();
  }, []);

  const getTokenFromPathname = (): string | null => {
    const pathname = window.location.pathname;
    const tokenStartIndex = pathname.lastIndexOf("/") + 1;
    return pathname.substring(tokenStartIndex);
  };

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch(`/api/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setStatus(res.status);
        toast.success("Email verified successfully! Please login.");
      } else {
        setMessage(data.message);
        setStatus(res.status);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setMessage("An error occurred. Please try again.");
      setStatus(500);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1>{message}</h1>
        {status === 200 && (
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
