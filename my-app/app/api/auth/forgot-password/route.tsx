import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required field
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.findUserByEmail(email);

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json(
        { message: 'If the email exists, a reset link has been sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user with reset token
    await db.updateUser(user._id.toString(), {
      resetToken,
      resetTokenExpiry
    });

    // In production, send email with reset link
    // For now, return token (REMOVE THIS IN PRODUCTION)
    console.log('Reset token:', resetToken);
    console.log('Reset link:', `http://localhost:3000/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { 
        message: 'If the email exists, a reset link has been sent',
        // Remove this in production - only for testing
        resetToken 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}