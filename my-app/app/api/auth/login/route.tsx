import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { validateEmail, validateMobile } from '@/lib/validation';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier can be email or mobile

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    // Validate identifier format (email or mobile)
    const isEmail = validateEmail(identifier);
    const isMobile = validateMobile(identifier);

    if (!isEmail && !isMobile) {
      return NextResponse.json(
        { error: 'Invalid email or mobile number format' },
        { status: 400 }
      );
    }

    // Find user by email or mobile
    const user = db.findUserByEmailOrMobile(identifier);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    // Return success response (exclude password)
    const { password: _, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutSensitiveData,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
