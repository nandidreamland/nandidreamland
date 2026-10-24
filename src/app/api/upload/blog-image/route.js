import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify admin token
async function verifyAdminToken(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return { isValid: false, error: 'Your session has expired. Please log in again.' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return { isValid: false, error: 'Only admins can upload images.' };
    }

    return { isValid: true, userId: decoded.id };
  } catch (error) {
    return { isValid: false, error: 'Your session has expired. Please log in again.' };
  }
}

// POST - Upload blog image (admin only)
export async function POST(request) {
  try {
    // Verify admin token
    const tokenVerification = await verifyAdminToken(request);
    if (!tokenVerification.isValid) {
      return NextResponse.json(
        { success: false, message: tokenVerification.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'Please choose an image file to upload.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: 'That file is empty. Please pick a different image.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'This file type is not supported. Please upload a JPG, PNG or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `This image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please upload an image under 5MB.`,
        },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) {
      console.error('Cloudinary env vars missing');
      return NextResponse.json(
        { success: false, message: 'Image storage is not set up on the server. Please contact your developer.' },
        { status: 500 }
      );
    }

    // Upload to Cloudinary (the server filesystem is read-only on Vercel)
    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', file);
    cloudinaryForm.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryForm }
    );
    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary upload failed:', cloudinaryData);
      return NextResponse.json(
        {
          success: false,
          message: `The image could not be saved (${cloudinaryData.error?.message || 'image service error'}). Please try again or use a different image.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: cloudinaryData.secure_url,
        fileName: cloudinaryData.public_id,
        size: cloudinaryData.bytes,
        type: file.type,
      },
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while uploading. Please check your internet connection and try again.',
      },
      { status: 500 }
    );
  }
}
