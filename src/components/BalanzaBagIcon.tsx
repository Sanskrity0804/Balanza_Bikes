import React, { useState, useEffect } from 'react';

interface BalanzaBagIconProps {
  className?: string;
}

const processedCache: Record<string, string> = {};
const processingPromises: Record<string, Promise<string>> = {};

function processBagImage(src: string): Promise<string> {
  if (processedCache[src]) {
    return Promise.resolve(processedCache[src]);
  }
  if (processingPromises[src]) {
    return processingPromises[src];
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Sample background reference color from the top-left (0,0) pixel
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        // Sensible threshold for color matching to capture JPEG compression artifacts
        const threshold = 65;
        const isBg = (r: number, g: number, b: number) => {
          const rd = r - bgR;
          const gd = g - bgG;
          const bd = b - bgB;
          return Math.sqrt(rd * rd + gd * gd + bd * bd) < threshold;
        };

        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        const visit = (x: number, y: number) => {
          if (x < 0 || x >= width || y < 0 || y >= height) return;
          const idx = y * width + x;
          if (visited[idx]) return;
          visited[idx] = 1;

          const p = idx * 4;
          if (isBg(data[p], data[p+1], data[p+2])) {
            data[p+3] = 0; // Make pixels fully transparent
            queue.push(x, y);
          }
        };

        // Seed with all border coordinates
        for (let x = 0; x < width; x++) {
          visit(x, 0);
          visit(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          visit(0, y);
          visit(width - 1, y);
        }

        // BFS traversal
        let qHead = 0;
        while (qHead < queue.length) {
          const x = queue[qHead++];
          const y = queue[qHead++];

          visit(x - 1, y);
          visit(x + 1, y);
          visit(x, y - 1);
          visit(x, y + 1);
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        processedCache[src] = dataUrl;
        resolve(dataUrl);
      } catch (e) {
        resolve(src);
      }
    };
    img.onerror = () => {
      resolve(src);
    };
    img.src = src;
  });

  processingPromises[src] = promise;
  return promise;
}

export default function BalanzaBagIcon({ className = 'w-12 h-12' }: BalanzaBagIconProps) {
  const [imageError, setImageError] = useState(false);
  const [bagSrc, setBagSrc] = useState<string>(processedCache['/images/BalanzaBagIcon.jpeg'] || '/images/BalanzaBagIcon.jpeg');

  useEffect(() => {
    if (!processedCache['/images/BalanzaBagIcon.jpeg']) {
      processBagImage('/images/BalanzaBagIcon.jpeg').then(setBagSrc);
    }
  }, []);

  if (!imageError) {
    return (
      <img
        src={bagSrc}
        alt="Balanza Bag Icon"
        onError={() => setImageError(true)}
        className={`${className} object-contain select-none`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 500 550"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft studio lighting gradient for the front face of the bag */}
        <linearGradient id="bagFrontGrad" x1="110" y1="180" x2="420" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FAF9F6" />
          <stop offset="100%" stopColor="#EFEBDE" />
        </linearGradient>

        {/* Soft shadow gradient for the inner rim crease */}
        <linearGradient id="bagInnerShadow" x1="110" y1="180" x2="110" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.15)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </linearGradient>
      </defs>

      {/* 1. Large ambient drop shadow underneath the bag */}
      <ellipse cx="250" cy="505" rx="200" ry="25" fill="rgba(17, 17, 17, 0.05)" filter="blur(8px)" />
      <ellipse cx="250" cy="502" rx="150" ry="15" fill="rgba(17, 17, 17, 0.08)" />

      {/* 2. Back Cord Handle (Layered behind the bag) */}
      <path
        d="M 190 185 C 190 40, 310 40, 310 185"
        stroke="#111111"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 190 185 C 190 40, 310 40, 310 185"
        stroke="#2E2E2E"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Interior of the paper bag (visible through top opening) */}
      <path
        d="M 110 180 L 140 195 L 420 195 L 390 180 Z"
        fill="#D6D5CF"
      />
      {/* Shadow inside the rim */}
      <path
        d="M 110 180 L 140 195 L 420 195 L 390 180 Z"
        fill="url(#bagInnerShadow)"
      />

      {/* 4. Side Gusset (Depth block on the right) with V-crease folds */}
      {/* Left half of side fold (folds inwards) */}
      <path
        d="M 390 180 L 405 187.5 L 432.5 472.5 L 420 480 Z"
        fill="#DAD9D3"
      />
      {/* Right half of side fold */}
      <path
        d="M 405 187.5 L 420 195 L 445 465 L 432.5 472.5 Z"
        fill="#EBEAE4"
      />
      {/* Crease line shadow */}
      <path
        d="M 405 187.5 L 432.5 472.5"
        stroke="#B4B3AD"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 5. Main Front Face of the bag */}
      <path
        d="M 110 180 L 390 180 L 420 480 L 80 480 Z"
        fill="url(#bagFrontGrad)"
      />

      {/* Soft overlay lines to denote premium folded paper borders */}
      <path
        d="M 110 180 L 80 480"
        stroke="#E3E2DC"
        strokeWidth="2"
      />
      <path
        d="M 390 180 L 420 480"
        stroke="#EAD9C8"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* 6. Central Black Circular Decal */}
      <circle cx="250" cy="340" r="82" fill="#151515" />

      {/* 7. Stylized White "B" Balance Bike Monogram inside Decal */}
      {/* Left Wheel Rim */}
      <circle cx="212" cy="365" r="16" stroke="#FFFFFF" strokeWidth="9.5" fill="none" />
      {/* Left Wheel Axle (Inner Dot) */}
      <circle cx="212" cy="365" r="4.5" fill="#151515" />

      {/* Right Wheel Rim */}
      <circle cx="282" cy="365" r="16" stroke="#FFFFFF" strokeWidth="9.5" fill="none" />
      {/* Right Wheel Axle (Inner Dot) */}
      <circle cx="282" cy="365" r="4.5" fill="#151515" />

      {/* Horizontal Connector Frame Line */}
      <path
        d="M 212 365 L 282 365"
        stroke="#FFFFFF"
        strokeWidth="9.5"
        strokeLinecap="round"
      />

      {/* Cursive Bicycle-frame "B" Shapes */}
      {/* Main stem & fork */}
      <path
        d="M 212 365 L 246 295"
        stroke="#FFFFFF"
        strokeWidth="9.5"
        strokeLinecap="round"
      />
      {/* Top Handlebar / Accent Cap */}
      <path
        d="M 235 292 C 235 292, 252 291, 260 294"
        stroke="#FFFFFF"
        strokeWidth="8.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Upper Lobe of "B" (styled like seat/frame loop) */}
      <path
        d="M 246 295 C 280 295, 290 323, 250 328"
        stroke="#FFFFFF"
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lower Lobe of "B" curving elegantly down into the front axle */}
      <path
        d="M 250 328 C 286 328, 292 365, 282 365"
        stroke="#FFFFFF"
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 8. Front Cord Handle (Layered on top of front face) */}
      <path
        d="M 180 215 C 180 30, 320 30, 320 215"
        stroke="#111111"
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 180 215 C 180 30, 320 30, 320 215"
        stroke="#2E2E2E"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* 9. Premium Metal Grommets (where handles enter the bag) */}
      {/* Front Left Grommet */}
      <circle cx="180" cy="215" r="14" fill="#2E2E2E" />
      <circle cx="180" cy="215" r="11" fill="#111111" />
      <circle cx="180" cy="215" r="7" fill="#000000" />
      {/* Front Right Grommet */}
      <circle cx="320" cy="215" r="14" fill="#2E2E2E" />
      <circle cx="320" cy="215" r="11" fill="#111111" />
      <circle cx="320" cy="215" r="7" fill="#000000" />
    </svg>
  );
}
