
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = ({ price }: { price: number }) => {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-md text-center">
      <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
      <p>Your payment of ${price} was successful.</p>
      <button
        onClick={() => router.push("/dashboard/books")}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Go to Books Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
