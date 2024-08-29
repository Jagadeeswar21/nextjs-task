// pages/bookPage.tsx
'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";

const BookPage = () => {
  const [books, setBooks] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch books from API
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white shadow-md rounded-lg p-4 w-fit">
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={200}
              height={300}
              className="rounded-md"
            />
            <h2 className="mt-4 text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-500 mt-2">${book.price}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;
