import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    fullName: {
        type: String,
        required: [true, "Please provide your full name"],
    },
    contactNumber: {
        type: String,
        required: [true, "Please provide your contact number"],
    },
    role: {
        type: String,
        enum: ["driver", "employer"],
        required: [true, "Please provide a user role"],
    },
    // cvUrl: {
    //     type: String, // This will store the URL of the CV
    //     default: "", // Default value is null
    // },

    profile: {
        type: {
            avatar: String,
            location: String,
            bio: String,
            experience: String, // Specific to drivers
            companyName: String, // Company name is specific to employers
            rating: Number,
        },
        required: false
    },
    resetPasswordToken: String,
});

// Define the User model
const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
