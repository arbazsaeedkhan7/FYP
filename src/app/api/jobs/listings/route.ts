// /pages/api/jobs/listings.ts

import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/jobPostModel';

/**
 * Handler function for handling GET requests to fetch job listings.
 * @param request NextRequest The incoming request object.
 * @returns NextResponse The response object.
 */
export async function GET(request: NextRequest) {
  try {
    // Retrieve all job listings from the database
    const jobListings = await JobPost.find();

    // Return success response with the list of job listings
    return NextResponse.json({ jobListings });
  } catch (error: any) {
    // Handle any errors and return error response
    console.error('Error fetching job listings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
