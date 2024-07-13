'use client'
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  console.log(session);

  const router = useRouter();

  const checkUserRole = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (sessionData?.user?.roles.includes("admin")) {
        router.push("/adminDashboard");
      } else if(sessionData?.user?.roles.includes("user")) {
        router.push("/dashboard");
      }if(sessionData?.user?.roles.includes("manager")) {
        router.push("/manager");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setError("An error occurred. Please try again.");
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }
      toast.success("Login successful!", {
        position: "bottom-right"
      });
      await checkUserRole();
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        setError("Failed to sign in with Google");
        return;
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleGitHubSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("github", { redirect: false });
      if (res?.error) {
        setError("Failed to sign in with GitHub");
        return;
      }
     // await checkUserRole();
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-200">
      <div className="shadow-lg p-6 rounded-lg border bg-white w-[420px]">
        <h1 className="text-xl font-bold text-center text-black my-4">Login Page</h1>
        <form onSubmit={handleSubmit} className="flex text-white flex-col gap-3">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="placeholder-gray text-gray border border-gray  focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md shadow-sm py-2 px-4 block w-full sm:text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="placeholder-gray text-gray border border-gray  focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md shadow-sm py-2 px-4 block w-full sm:text-sm"

          />
          <button className="bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-bold px-6 py-2 mt-3">Login</button>
          {error && (
            <div className="text-red-500 w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
        <div className="flex justify-between w-full mt-3">
        <Link className="text-sm mt-3 text-black underline" href="/forget-password">Forgot Password?</Link>
        <Link className="text-sm mt-3 text-black text-right flex justify-end" href="/Register">
           <span className="underline">Register</span>
        </Link>
        </div>
        <div className="flex items-center justify-center my-2">
          <div className="border-t border-gray-400 flex-grow"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="border-t border-gray-400 flex-grow"></div>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-bold px-4 py-2 mt-3 flex w-full justify-center items-center"
        >
          Sign in with Google
        </button>
        <div className="flex items-center justify-center my-2">
          <div className="border-t border-gray-400 flex-grow"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="border-t border-gray-400 flex-grow"></div>
        </div>
        
        <button
          onClick={handleGitHubSignIn}
          className="bg-blue-500 rounded-lg hover:bg-blue-400 text-white font-bold px-4 py-2 mt-3 flex w-full justify-center items-center "
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );` `
}
