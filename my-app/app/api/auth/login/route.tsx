import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { validateEmail, validateMobile } from '@/lib/validation';


export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    console.log('Raw request body:', bodyText); // Debug log

    if (!bodyText) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      );
    }

    const body = JSON.parse(bodyText);
    console.log('Parsed request body:', body); // Debug log

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
    const user = await db.findUserByEmailOrMobile(identifier);

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
      userId: user._id.toString(),
      email: user.email
    });

    console.log('Generated token for user:', user.email); // Debug log

    // Return success response (exclude password)
    const { password: _, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutSensitiveData,
        token
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with the token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    console.log('Cookie set, returning response'); // Debug log

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
