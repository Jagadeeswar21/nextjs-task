"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const amount = searchParams.get("amount");
    if (amount) {
      setPrice(parseFloat(amount));
    }
  }, [searchParams]);

  if (price === null) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-md text-center">
      <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
      <p>Your payment of ${price.toFixed(2)} was successful.</p>
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
