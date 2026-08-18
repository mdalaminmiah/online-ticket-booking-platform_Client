import axios from 'axios';
import { env } from '@/config/env';

export async function uploadImage(file: File): Promise<string> {
  if (!env.imgbbApiKey) {
    throw new Error('Image upload is not configured (missing VITE_IMGBB_API_KEY)');
  }
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${env.imgbbApiKey}`,
    formData,
  );
  return data.data.url as string;
}
