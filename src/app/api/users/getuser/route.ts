// pages/api/users/getUser.ts

import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb"; // Adjust this path as needed
import User from "../../../../../models/schema"; // Adjust this path as needed
import { getToken } from "next-auth/jwt"; // Import getToken to handle session

// Connect to the database
connectMongoDB();

// Function to get the current user from the token
async function getCurrentUser(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      console.error("Token not found in request:", request);
      return null;
    }
    console.log("Token retrieved:", token);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET endpoint called");
    
    // Get the current user session
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user by their ID from the token
    const user = await User.findOne({ _id: currentUser.sub });
    console.log(user)

    // If the user is not found, return a not found status
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user's purchased books
    return NextResponse.json({ purchasedBooks: user.purchasedBooks || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Error fetching user data", error }, { status: 500 });
  }
}
