"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
try{
    const res = await fetch("api/router", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
return(
        <div className="grid place-items-center h-screen "> 
            <div className="shadow-lg p-6 rounded-lg border-t-4 bg-orange-200 ">
                <h1 className="text-xl font-bold my-4 bg-red-700"> Registration Page</h1>
  
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
                 <input 
                    type="text" 
                    placeholder="Name"
                    onChange={(e)=>setName(e.target.value)}/>
                <input 
                    type="text"
                    placeholder="Email"
                    onChange={(e)=>setEmail(e.target.value)}/>
                <input 
                    type="password" 
                    placeholder="password"
                    onChange={(e)=>setPassword(e.target.value)}/>

                   <button className="bg-orange-400 text-white cursor-pointer font-bold px-6 py-2">Register</button>
                   
                   {error && (
                   <div className="bg-red-500 text-white w-fit text-sm py-1 px-2 rounded-md mt-2">
                   {error}
                   </div>
                   )}
                   <Link className="text-sm mt-3 text-right" href={"/"}>already user?<span className="underline">login</span></Link>
                </form>
            </div>
        </div>
    )
}
