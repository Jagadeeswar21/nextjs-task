
'use client'
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials")
        return;
      }
      toast.success("Login successful!",{
        position:"bottom-right"
      });
      
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()

      if (session?.user?.role === "admin") {
        router.push("/adminDashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-orange-200">
        <h1 className="text-xl font-bold my-4">Login Page</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-orange-400 text-white font-bold px-6 py-2">Login</button>
          {error && (
            <div className="text-red-500 w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href="/Register">
            Don t have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
