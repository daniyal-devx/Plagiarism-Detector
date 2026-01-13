/**
 * Document Processing Module
 * Handles file parsing and URL content fetching
 */

export interface Document {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'url';
  source: string;
}

export class DocumentProcessor {
  /**
   * Extracts text from uploaded file based on type
   */
  static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileType) {
      case 'txt':
        return await this.extractFromTxt(file);
      case 'pdf':
        return await this.extractFromPdf(file);
      case 'docx':
        return await this.extractFromDocx(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Extracts text from TXT file
   */
  private static async extractFromTxt(file: File): Promise<string> {
    return await file.text();
  }

  /**
   * Extracts text from PDF file (client-side)
   * Note: For production, consider using pdf-parse on server side
   */
  private static async extractFromPdf(file: File): Promise<string> {
    // This is a placeholder - actual PDF parsing should be done server-side
    // using libraries like pdf-parse or pdfjs-dist
    return `[PDF content from ${file.name} - processing on server]`;
  }

  /**
   * Extracts text from DOCX file (client-side)
   * Note: For production, use mammoth.js on server side
   */
  private static async extractFromDocx(file: File): Promise<string> {
    // Placeholder - actual DOCX parsing should be done server-side
    return `[DOCX content from ${file.name} - processing on server]`;
  }

  /**
   * Fetches and extracts text from URL
   * Must be called through API route due to CORS restrictions
   */
  static async fetchTextFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error fetching URL:', error);
      throw new Error('Failed to fetch content from URL');
    }
  }

  /**
   * Validates URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generates unique document ID
   */
  static generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates document object from file
   */
  static async createDocumentFromFile(file: File): Promise<Document> {
    const content = await this.extractTextFromFile(file);
    
    return {
      id: this.generateDocumentId(),
      name: file.name,
      content,
      type: 'file',
      source: file.name,
    };
  }

  /**
   * Creates document object from URL
   */
  static async createDocumentFromUrl(url: string): Promise<Document> {
    const content = await this.fetchTextFromUrl(url);
    
    return {
      id: this.generateDocumentId(),
      name: new URL(url).hostname,
      content,
      type: 'url',
      source: url,
    };
  }
}
