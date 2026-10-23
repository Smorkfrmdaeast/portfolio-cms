export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores into single hyphen
    .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Normalizes image paths so relative 'assets/...' becomes absolute '/assets/...',
 * ensuring images load on both root ('/') and deep nested routes ('/work/:slug'),
 * while preserving full external URLs ('https://...') and data URLs.
 */
export function normalizeImagePath(path?: string): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/assets/smorks-paydom-platform.jpg';
  }
  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }
  // Convert relative 'assets/...' to root absolute '/assets/...'
  return `/${trimmed}`;
}

/**
 * Validates image type and size, then compresses it client-side into WebP data URL
 */
export async function processAndCompressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }

  // Validate size (max 8MB before compression)
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image file is too large (must be under 8MB)');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.width;
      let targetHeight = img.height;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context could not be initialized'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert to WebP format
      const dataUrl = canvas.toDataURL('image/webp', quality);
      // Approximate size from base64 string
      const sizeBytes = Math.round((dataUrl.length * 3) / 4);

      resolve({
        dataUrl,
        width: targetWidth,
        height: targetHeight,
        sizeBytes,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read and process image file'));
    };

    img.src = objectUrl;
  });
}
