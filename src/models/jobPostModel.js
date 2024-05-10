import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  employer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  applicationDeadline: { // Include applicationDeadline field
    type: Date,
    required: true,
  },
  applicants: {
    type: [String], // Array of strings to store emails of applicants
    default: [], // Initialize as an empty array
  },
});

const JobPost = mongoose.models.jobs || mongoose.model('jobs', jobPostSchema);

export default JobPost;
