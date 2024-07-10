"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function ResetPassword({ params }: any) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
          }),
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setVerified(true);
        } else {
          setError("Invalid token or has expired");
          setVerified(false);
        }
      } catch (error: any) {
        setError("Error.. Try Again: " + error.message);
        console.log(error);
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
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email,
        }),
      });
      if (res.ok) {
        toast.success("Password reset successfully");
        router.push("/");
      } else {
        setError("User with this email is not registered.");
      }
    } catch (error: any) {
      setError("Error during password reset: " + error.message);
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
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-orange-200">
        <h1 className="text-xl font-bold my-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="password" placeholder="New Password" required />
          <input type="password" placeholder="Confirm New Password" required />
          <button className="bg-orange-400 rounded-lg text-white font-bold px-6 py-2">
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
