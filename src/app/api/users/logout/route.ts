import { NextResponse } from "next/server"; // Importing NextResponse from Next.js server library

// Handler function for handling GET request to logout user
export async function GET() {
    try {
        // Create response object with success message
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        // Clear cookies for token and email
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) }); // Set token cookie to empty string and expire it
        response.cookies.set("email", "", { httpOnly: true, expires: new Date(0) }); // Set email cookie to empty string and expire it

        return response; // Return success response with cleared cookies
    } catch (error: any) {
        // Handle errors and return error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
