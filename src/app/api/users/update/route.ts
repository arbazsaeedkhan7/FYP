// /api/users/update.ts

import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

connect();

/**
 * Handler function for handling POST requests to update a user's profile.
 * @param request NextRequest The incoming request object.
 * @returns NextResponse The response object.
 */
export async function POST(request: NextRequest) {
  try {
    // Extract data from the request body
    const { field, value, decodedToken } = await request.json();

    // Check if the decoded token is valid
    if (!decodedToken || !decodedToken.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find the user by email
    const user = await User.findOne({ email: decodedToken.email });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's profile field
    if (field === "contactNumber") {
      user.contactNumber = value; // Update the contact number field
    } else if (field === "location") {
      user.profile.location = value;
    } else if (field === "bio") {
      user.profile.bio = value;
    } else if (field === "experience") {
      user.profile.experience = value;
    } else if (field === "companyName") {
      user.profile.companyName = value; // Update the company name field
    }

    // Save the updated user
    await user.save();

    // Return success response with updated user data
    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    // Handle any errors and return error response
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
