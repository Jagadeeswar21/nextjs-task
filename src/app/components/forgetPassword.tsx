"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordService from "@/services/passwordService";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await PasswordService.forgetPassword(email);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-200">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-white">
        <h1 className="text-xl font-bold my-4 text-black">Forget Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md"
          />
          <button className="bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-bold px-6 py-2">
            Submit
          </button>
          {error && (
            <div className="text-red-500 w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
        <Link className="text-sm mt-3 text-right flex justify-end" href="/">
          or already user? <span className="underline">login</span>
        </Link>
      </div>
    </div>
  );
}
