import nextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import User from "../../../../../models/schema";
import bcrypt from 'bcryptjs';
import { connectMongoDB } from "../../../../../lib/mongodb";


const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            name: 'credentials',
            credentials:{
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials){
                console.log(credentials)
                if (!credentials) {
                    return null;
                  }
                const {email,password}=credentials;

                try {
                    await connectMongoDB();
                    const user=await User.findOne({email})
                     if(!user){
                        return null;
                     }
                     const passwordMatch=await bcrypt.compare(password,user.password);
                     if(!passwordMatch){
                        return null;
                     }
                     return user;
                    
                } catch (error) {
                    console.log(error)
                    
                }
                
            }
        }),

    ],
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"/"
    }
    
};

const handler=nextAuth(authOptions);

export {handler as Get, handler as POST}