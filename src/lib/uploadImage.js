// Shared browser-side image upload. Returns { url } or throws an Error whose
// message is safe to show a non-technical user.
const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at ~4.5MB

export async function uploadImage(file) {
  if (!file) throw new Error('Please choose an image file to upload.');

  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('This file type is not supported. Please upload a JPG, PNG or WebP image.');
  }

  if (file.size === 0) {
    throw new Error('That file is empty. Please pick a different image.');
  }

  if (file.size > MAX_BYTES) {
    throw new Error(
      `This image is ${(file.size / 1024 / 1024).toFixed(1)}MB, which is too large. Please upload an image under 4MB.`
    );
  }

  const body = new FormData();
  body.append('image', file);

  let data;
  try {
    const response = await fetch('/api/upload/blog-image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body,
    });
    data = await response.json();
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Could not reach the server. Please check your internet connection and try again.');
  }

  if (!data?.success) {
    throw new Error(data?.message || 'The image could not be uploaded. Please try again.');
  }

  return data.data;
}
