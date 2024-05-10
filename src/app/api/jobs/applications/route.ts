import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/jobPostModel';

connect();

export async function POST(request: NextRequest) {
  try {
    const { employerEmail } = await request.json();

    // Fetch all job posts created by the employer
    const jobPosts = await JobPost.find({ employer: employerEmail });

    return NextResponse.json({ jobPosts });
  } catch (error: any) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
