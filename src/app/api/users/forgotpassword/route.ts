// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Establish database connection
connect();

// Create Nodemailer transporter with Mailtrap configuration
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "bab0864a223495",
        pass: "5f80a26ffa19b1",
    },
});

// Handler function for forgotPassword API endpoint
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        
        console.log("Email received:", email); // Log the received email

        // Check if user with provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found"); // Log user not found
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("User found:", user); // Log the found user

        // Generate secure token using bcryptjs
        const token = await bcrypt.hash(email, 10);

        console.log("Generated token:", token); // Log the generated token

        // Update user document with hashed token
        user.resetPasswordToken = token;
        await user.save();

        console.log("User saved:", user); // Log the saved user

        // Compose email message
        const mailOptions = {
            from: "Arbaaz Khan <arbazsaeedkhan7@gmail.com>",
            to: email,
            subject: "Password Reset Instructions",
            text: `To reset your password, click on the following link: ${process.env.domain}/resetpassword?token=${token}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log("Password reset instructions sent"); // Log password reset instructions sent

        // Return success response
        return NextResponse.json({ message: "Password reset instructions sent to your email." });
    } catch (error: any) {
        // Handle errors
        console.error("Forgot password failed", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
