import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt, { JwtPayload } from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const { decodedToken } = await request.json();
        console.log("Access token received:", decodedToken);

        // Fetch user profile data from the database by email
        const user = await User.findOne({ email: decodedToken.email });
        console.log("User profile data:", user);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check user role and return appropriate response
        if (user.role === 'employer') {
            return NextResponse.json({
                fullName: user.fullName,
                email: user.email,
                contactNumber: user.contactNumber,
                profile: {
                    location: user.profile.location,
                    bio: user.profile.bio,
                    experience: user.profile.experience,
                }
            });
        } else if (user.role === 'driver') {
            return NextResponse.json({
                fullName: user.fullName,
                email: user.email,
                contactNumber: user.contactNumber,
                profile: {
                    location: user.profile.location,
                    bio: user.profile.bio,
                    experience: user.profile.experience,
                    // Add other profile fields as needed for driver
                }
            });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
