
import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/jobPostModel';
import { NextApiRequest } from 'next';

connect();

export async function POST(request: NextRequest) {
  try {
    const { title, description, requirements, location, salary, employer, createdAt, applicationDeadline, // Include applicationDeadline field
  } = await request.json();

    const newJob = new JobPost({
      title,
      description,
      requirements,
      location,
      salary,
      employer,
      createdAt,
      applicationDeadline, // Include applicationDeadline field
      applicants: [], // Initialize applicants array
    });

    await newJob.save();

    return NextResponse.json({ message: 'Job post created successfully', job: newJob });
  } catch (error: any) {
    console.error('Error creating job post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



export async function PUT(request: NextRequest) {
  try {
    const { jobId, email } = await request.json();

    const job = await JobPost.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const alreadyApplied = job.applicants.includes(email);
    if (alreadyApplied) {
      return NextResponse.json({ message: 'You have already applied for this job' });

  } else {
      job.applicants.push(email);
      await job.save();
      console.log('Job application submitted successfully.');
      return NextResponse.json({ message: 'Job application submitted successfully' });

  }
  } catch (error: any) {
    console.error('Error submitting job application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextApiRequest) {
  try {
    const { employer } = request.query;

    console.log('Fetching job posts for employer:', employer);

    // Fetch job posts created by the employer
    const jobPosts = await JobPost.find({ employer });

    console.log('Job posts fetched successfully:', jobPosts);

    return NextResponse.json({ jobPosts });
  } catch (error: any) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}