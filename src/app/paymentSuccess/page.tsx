"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess({
  searchParams: { amount },
  userId,
  bookId,
}: {
  searchParams: { amount: string };
  userId: string;
  bookId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const storeOrder = async () => {
      try {
      

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, bookId, amount }),
        });

        if (!response.ok) {
          throw new Error("Failed to store order information");
        }
        router.push("/dashboard/books");
      } catch (error) {
        console.error("Error storing order information:", error);
      }
    };
    storeOrder();
  }, [amount, userId, bookId, router]);

  return (
    <main className="max-w-2xl mx-auto p-10 text-black bg-gray-400 text-center border m-10 rounded-md bg-gradient-to-tr">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>
        <div className="bg-white p-2 rounded-md text-black mt-5 text-xl font-lg">
          ${amount}
        </div>
      </div>
    </main>
  );
}
