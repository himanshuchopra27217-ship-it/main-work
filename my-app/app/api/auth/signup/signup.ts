import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateEmail, validateMobile, validatePassword } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body, "haras")
    const { name, email, password, mobile } = body;

    if (!name || !email || !password || !mobile) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate mobile format
    if (!validateMobile(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number (must be 10 digits)' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await db.findUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const existingUserByMobile = await db.findUserByMobile(mobile);
    if (existingUserByMobile) {
      return NextResponse.json(
        { error: 'Mobile number already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.createUser({
      name,
      email,
      mobile,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    } as any);

    // Generate JWT token
    const token = await generateToken({
      userId: newUser._id?.toString() || '',
      email: newUser.email
    });

    // Return success response (exclude password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
