"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  bookId: {
    title: string;
    price: string;
    imageUrl: string;
  };
  paymentId: string;
  amount: number;
  createdAt: string;
}

const OrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        setError("Error fetching orders");
      }
    };

    fetchOrders();
  }, [session]);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = orders.filter(order =>
        order.bookId.title.toLowerCase().includes(lowercasedQuery) ||
        order.paymentId.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Orders</h1>
        <input
          type="text"
          placeholder="Search by book title or payment ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg text-sm w-48 bg-white"
        />
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-3">
            <img
              src={order.bookId.imageUrl}
              alt={order.bookId.title}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 text-sm">
              <h3 className="font-semibold text-base">{order.bookId.title}</h3>
              <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">Amount: ${order.amount.toFixed(2)}</p>
              <p className="text-gray-600">Payment ID: {order.paymentId}</p>
              <p className="text-gray-600">User: {session?.user?.name || 'Unknown'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
