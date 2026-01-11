import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateProfile } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetRole } = body;

    if (!targetRole || !['worker', 'hiring'].includes(targetRole)) {
      return NextResponse.json(
        { error: 'Invalid target role' },
        { status: 400 }
      );
    }

    // Update the user's profile role
    const updatedProfile = await updateProfile(session.userId, { role: targetRole });

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Role switched successfully',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Switch role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}