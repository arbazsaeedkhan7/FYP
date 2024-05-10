import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { verify } from "jsonwebtoken"; // For token handling

// Establish database connection
connect();

// Handler function for forgotPassword API endpoint
export async function POST(request: NextRequest) {
  console.log("Reset password request received");

  try {
    const { password, confirmPassword, token } = await request.json();
    console.log("Received request with token:", token);

    // Check if all required fields are provided
    if (!password || !confirmPassword || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find user by resetPasswordToken
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user document with new password and clear resetPasswordToken
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    console.log("Password reset successful");

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error("Reset password failed:", error.message);
    return NextResponse.json({ error: "Reset password failed" }, { status: 500 });
  }
}
