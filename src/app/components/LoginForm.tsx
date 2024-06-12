'use client'
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const res=await signIn("credentials",{
                email,password,redirect:false,});
                if(res?.error){
                    setError("invalid credentials")
                    return;
                }
                router.replace("dashboard")
            }catch(error){
                console.log(error)
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
                        <div className="text-red w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                        </div>
                    )}

                    <Link className="text-sm mt-3 text-right" href="/register">
                        Don t have an account? <span className="underline">Register</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
