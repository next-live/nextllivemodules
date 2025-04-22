"use server"

import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure the images directory exists
const imagesDirectory = path.join(process.cwd(), 'public/images');
try {
  if (!existsSync(imagesDirectory)) {
    console.log('Creating images directory at:', imagesDirectory);
    mkdirSync(imagesDirectory, { recursive: true });
  }
} catch (error) {
  console.error('Error creating images directory:', error);
}

interface SaveImageResult {
  success: boolean;
  fileName?: string;
  path?: string;
  error?: string;
}

export async function saveImage(base64Data: string, filename: string): Promise<SaveImageResult> {
  try {
    if (!base64Data || !filename) {
      return {
        success: false,
        error: 'Base64 data and filename are required'
      };
    }

    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Save the file
    const filePath = path.join(imagesDirectory, filename);
    await writeFile(filePath, imageBuffer);
    
    return {
      success: true,
      fileName: filename,
      path: `/images/${filename}`
    };
    
  } catch (error) {
    console.error('Error saving image:', error);
    return {
      success: false,
      error: 'Failed to save image'
    };
  }
} 