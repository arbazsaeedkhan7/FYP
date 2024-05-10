import { connect } from "@/dbConfig/dbConfig"; // Importing database connection function from custom module
import { NextRequest, NextResponse } from "next/server"; // Importing Next.js request and response objects
import bcrypt from "bcryptjs"; // Importing bcryptjs for password hashing
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for token generation
import User from "@/models/userModel"; // Importing User model from custom module

connect(); // Establishing connection to the database

/**
 * Handler function for handling POST requests to authenticate a user and generate a JWT token.
 * @param request NextRequest The incoming request object.
 * @returns NextResponse The response object.
 */
export async function POST(request: NextRequest) {
    try {
        // Extracting email and password from the request body
        const { email, password } = await request.json();

        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            // If user does not exist, return error response
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // Check if the provided password matches the hashed password stored in the database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // If password is invalid, return error response
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        // Create token data with user information
        const tokenData = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        // Generate JWT token with the token data
        const token = jwt.sign(tokenData, process.env.tokenSecret!, { expiresIn: "1d" });

        // Return success response with token in cookies
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            token: token,
            role: user.role,
            email: user.email,
        });

        // Set the token in HTTP-only cookie for security
        response.cookies.set("token", token, {
            //httpOnly: true,
            path: "/", // Set the path to root to ensure it's accessible across the application
        });

        return response;
    } catch (error: any) {
        // Handle any errors and return error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
