import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();


        console.log("Received request body in backend:", reqBody); // Log received request body

        const { fullName, email, password, contactNumber, role } = reqBody;

        // Ensure that cvUrl is received correctly in the request body
        //console.log("Received cvUrl:", cvUrl);

        // Check if the received data is correct
        console.log("Received request body:", reqBody);

        let user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user = new User({
            fullName,
            email,
            password: hashedPassword,
            contactNumber,
            role,
            //cvUrl,
            profile: {
                avatar: "",
                location: "",
                bio: "",
                experience: "",
                companyName: "",
                rating: null,
            },
        });

        await user.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user,
        });
    } catch (error: any) {
        console.error("Signup failed", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
