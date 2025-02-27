import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// In a real app, you would use a cloud storage service like S3, GCS, etc.
// This is a mock implementation for development/demo purposes only

/**
 * Mock file upload service
 */
export class FileUploadService {
  private readonly uploadDir: string;
  
  constructor() {
    // Define upload directory - in a real app, this would be configurable
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    this.ensureUploadDirExists();
  }
  
  /**
   * Make sure the upload directory exists
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }
  
  /**
   * Save a file to the upload directory
   * 
   * @param file File object from form data
   * @param prefix Optional prefix for the filename
   * @returns URL to the uploaded file
   */
  async saveFile(file: File, prefix: string = ''): Promise<string> {
    try {
      // Generate a unique filename
      const fileExtension = this.getFileExtension(file.name);
      const fileName = `${prefix ? prefix + '-' : ''}${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);
      
      // For Next.js API routes, we need to convert the File to a Buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Write the file to disk
      fs.writeFileSync(filePath, buffer);
      
      // Return the relative URL (path from public directory)
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }
  
  /**
   * Get the file extension from a filename
   * 
   * @param filename Original filename
   * @returns File extension with dot (e.g., '.pdf')
   */
  private getFileExtension(filename: string): string {
    const ext = path.extname(filename);
    return ext || ''; // Return empty string if no extension
  }
  
  /**
   * Delete a file from the upload directory
   * 
   * @param fileUrl URL of the file to delete
   * @returns true if successful, false if file doesn't exist
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return false;
      }
      
      // Delete the file
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const fileUploadService = new FileUploadService();