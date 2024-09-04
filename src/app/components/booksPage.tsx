

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useSession } from "next-auth/react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BookPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([]);
  console.log(purchasedBooks)
  const { data: session } = useSession();
console.log(purchasedBooks)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Error fetching books");
        }
        const data = await response.json();
        const sortedBooks = data.sort(
          (a: any, b: any) => b.purchasedCount - a.purchasedCount
        );
        setBooks(sortedBooks);
        setLoading(false);
      } catch (error) {
        setError("Error fetching books");
        setLoading(false);
      }
    };

    const fetchPurchasedBooks = async () => {
      if (!session) return;
      try {
        const response = await fetch(`/api/users/getuser`);
        if (!response.ok) {
          throw new Error("Error fetching user data");
        }
        console.log(response,"resssss")
        const userData = await response.json();
        console.log(userData)
        setPurchasedBooks(userData?.purchasedBooks || []); // Safely handle undefined
      } catch (error) {
        console.error("Error fetching purchased books:", error);
        setPurchasedBooks([]); // Ensure it's always an array
      }
    };

    fetchBooks();
    fetchPurchasedBooks();
  }, [session]);

  const handleBuyNow = (book: any) => {
    setSelectedBook(book);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (selectedBook) {
    return (
      <main className="max-w-2xl mx-auto p-10 text-black text-center border m-10 mt-5 rounded-md bg-gradient-to-tr">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">{selectedBook.title}</h1>
          <h2 className="text-2xl">
            is now available at
            <span className="font-bold"> ${selectedBook.price}</span>
          </h2>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(selectedBook.price),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={selectedBook.price} bookId={selectedBook._id} />
        </Elements>
      </main>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center relative"
          >
            {Array.isArray(purchasedBooks) && purchasedBooks.includes(book._id) && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                Purchased
              </span>
            )}
            <div className="w-full h-[18rem]">
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={80}
                height={120}
                className="rounded-md object-center w-full h-full"
              />
            </div>
            <h2 className="mt-3 text-lg font-medium text-center truncate w-full">
              {book.title}
            </h2>
            <p className="text-gray-500 text-sm mt-1 text-center">
              ${book.price}
            </p>
            <button
              onClick={() => handleBuyNow(book)}
              disabled={Array.isArray(purchasedBooks) && purchasedBooks.includes(book._id)}
              className={`mt-3 text-white text-sm px-2 py-1 rounded ${
                Array.isArray(purchasedBooks) && purchasedBooks.includes(book._id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-blue-600"
              }`}
            >
              {Array.isArray(purchasedBooks) && purchasedBooks.includes(book._id)
                ? "Purchased"
                : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;
