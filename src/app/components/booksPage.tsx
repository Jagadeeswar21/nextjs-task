'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

if (process.env.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BookPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  console.log(selectedBook)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Error fetching books");
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching books");
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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
            has requested
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
          <CheckoutPage 
            amount={selectedBook.price} 
            bookId={selectedBook._id} 
          />
        </Elements>
      </main>
    );
  }

  return (
    <div className="p-8">
  <h1 className="text-2xl font-bold mb-4">Books</h1>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {books.map((book) => (
      <div key={book._id} className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center">
        <div className="w-full h-[18rem]">
          <Image
            src={book.imageUrl}
            alt={book.title}
            width={80} 
            height={120}
            className="rounded-md  object-center w-full h-full"
          />
        </div>
        <h2 className="mt-3 text-lg font-medium text-center truncate w-full">{book.title}</h2>
        <p className="text-gray-500 text-sm mt-1 text-center">${book.price}</p>
        <button
          onClick={() => handleBuyNow(book)}
          className="mt-3 bg-black text-white text-sm px-2 py-1 rounded hover:bg-blue-600"
        >
          Buy Now
        </button>
      </div>
    ))}
  </div>
</div>


  );
};

export default BookPage;
