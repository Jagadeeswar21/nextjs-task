'use client';
import  { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
const AuthProvider = ({ children }) => {
  return <>
  <Toaster/>
  <SessionProvider>{children}</SessionProvider>;
  </>
};

export default AuthProvider;
