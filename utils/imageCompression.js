/**
 * Image Compression Pipeline
 * Provides client-side image compression and optimization
 * Supports WebP conversion, quality adjustment, and size reduction
 */

class ImageCompressionService {
  constructor() {
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    this.maxFileSize = 2 * 1024 * 1024; // 2MB
    this.defaultQuality = 0.8;
  }

  /**
   * Compress image file
   * @param {File} file - Image file to compress
   * @param {Object} options - Compression options
   * @returns {Promise<File>} Compressed image file
   */
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = this.defaultQuality,
      format = 'image/webp',
      maxSizeKB = 500
    } = options;

    if (!this.supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported image format: ${file.type}`);
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth, maxHeight);

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob.size > maxSizeKB * 1024) {
              // If still too large, reduce quality further
              const reducedQuality = Math.max(0.1, quality * 0.7);
              canvas.toBlob((reducedBlob) => {
                const compressedFile = new File([reducedBlob], file.name, { type: format });
                resolve(compressedFile);
              }, format, reducedQuality);
            } else {
              const compressedFile = new File([blob], file.name, { type: format });
              resolve(compressedFile);
            }
          }, format, quality);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate optimal dimensions maintaining aspect ratio
   */
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;

    // Scale down if larger than max dimensions
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Generate multiple sizes for responsive images
   * @param {File} file - Original image file
   * @param {Array} sizes - Array of size objects {width, height, suffix}
   * @returns {Promise<Array>} Array of compressed image files
   */
  async generateResponsiveImages(file, sizes = []) {
    const defaultSizes = [
      { width: 400, height: 300, suffix: '_small' },
      { width: 800, height: 600, suffix: '_medium' },
      { width: 1200, height: 900, suffix: '_large' },
      { width: 1920, height: 1080, suffix: '_xl' }
    ];

    const targetSizes = sizes.length > 0 ? sizes : defaultSizes;
    const compressedImages = [];

    for (const size of targetSizes) {
      try {
        const compressed = await this.compressImage(file, {
          maxWidth: size.width,
          maxHeight: size.height,
          quality: 0.85,
          format: 'image/webp'
        });

        // Create new filename with suffix
        const nameParts = file.name.split('.');
        const extension = nameParts.pop();
        const baseName = nameParts.join('.');
        const newName = `${baseName}${size.suffix}.webp`;

        const renamedFile = new File([compressed], newName, { type: 'image/webp' });
        compressedImages.push({
          file: renamedFile,
          width: size.width,
          height: size.height,
          size: compressed.size
        });
      } catch (error) {
        console.warn(`Failed to generate ${size.suffix} version:`, error);
      }
    }

    return compressedImages;
  }

  /**
   * Check if browser supports WebP
   */
  supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get image metadata without loading full image
   */
  async getImageMetadata(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          fileSize: file.size,
          format: file.type
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Batch compress multiple images
   */
  async compressImagesBatch(files, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 3;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(file => this.compressImage(file, options));

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map((result, index) => ({
          originalFile: batch[index],
          ...result
        })));
      } catch (error) {
        console.error('Batch compression error:', error);
      }
    }

    return results;
  }
}

// Export singleton instance
export const imageCompression = new ImageCompressionService();
export default imageCompression;