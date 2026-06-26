import React, { useState, useEffect } from 'react';

interface BalanzaLogoProps {
  className?: string;
  showIcon?: boolean;
}

// Global cache and promise registry for processed transparent data URLs
const processedCache: Record<string, string> = {};
const processingPromises: Record<string, Promise<string>> = {};

function processLogoImage(src: string): Promise<string> {
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

export default function BalanzaLogo({ className = 'h-8 md:h-10 w-auto', showIcon = true }: BalanzaLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const [textError, setTextError] = useState(false);
  
  const [logoSrc, setLogoSrc] = useState<string>(processedCache['/images/balanza-logo.jpeg'] || '/images/balanza-logo.jpeg');
  const [textSrc, setTextSrc] = useState<string>(processedCache['/images/balanza-text.jpeg'] || '/images/balanza-text.jpeg');

  useEffect(() => {
    if (!processedCache['/images/balanza-logo.jpeg']) {
      processLogoImage('/images/balanza-logo.jpeg').then(setLogoSrc);
    }
    if (!processedCache['/images/balanza-text.jpeg']) {
      processLogoImage('/images/balanza-text.jpeg').then(setTextSrc);
    }
  }, []);

  // Generate 22 shadow instances with an ultra-fine step of 0.35px for a perfectly seamless, solid 3D block extrusion
  const shadowSteps = Array.from({ length: 22 }, (_, i) => (i + 1) * 0.35);

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ WebkitTapHighlightColor: 'transparent' }}>
      {showIcon && (
        <span className="h-full flex items-center aspect-square shrink-0">
          {!logoError ? (
            <img 
              src={logoSrc} 
              alt="Balanza Logo Icon" 
              onError={() => setLogoError(true)}
              className="h-full w-auto object-contain rounded-xl select-none"
            />
          ) : (
            // Crisp Vector SVG Logo Icon with Brand Lime-Green container and deep black circle
            <svg viewBox="150 240 200 200" className="h-full w-auto max-h-[38px] rounded-xl overflow-hidden drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
              <rect x="150" y="240" width="200" height="200" fill="#A7E22E" />
              <circle cx="250" cy="340" r="82" fill="#000000" />
              <circle cx="212" cy="365" r="16" stroke="#FFFFFF" strokeWidth="9.5" fill="none" />
              <circle cx="212" cy="365" r="4.5" fill="#000000" />
              <circle cx="282" cy="365" r="16" stroke="#FFFFFF" strokeWidth="9.5" fill="none" />
              <circle cx="282" cy="365" r="4.5" fill="#000000" />
              <path d="M 212 365 L 282 365" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" />
              <path d="M 212 365 L 246 295" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" />
              <path d="M 235 292 C 235 292, 252 291, 260 294" stroke="#FFFFFF" strokeWidth="8.5" strokeLinecap="round" fill="none" />
              <path d="M 246 295 C 280 295, 290 323, 250 328" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" fill="none" />
              <path d="M 250 328 C 286 328, 292 365, 282 365" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            </svg>
          )}
        </span>
      )}

      {/* Text Logo Area */}
      <span className="h-full flex items-center">
        {!textError ? (
          <img 
            src={textSrc} 
            alt="Balanza Text Logo" 
            onError={() => setTextError(true)}
            className="h-[75%] w-auto object-contain select-none"
          />
        ) : (
          // Crisp 3D extruded Vector Text - completely transparent background
          <svg 
            viewBox="0 0 240 56" 
            className="h-[30px] md:h-[35px] w-auto drop-shadow-xs" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style type="text/css">
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
                  .logo-text {
                    font-family: 'Montserrat', 'Arial Black', Impact, sans-serif;
                    font-weight: 900;
                    font-size: 32px;
                    letter-spacing: 5px;
                  }
                  .logo-shadow {
                    fill: #000000;
                    stroke: #000000;
                    stroke-width: 3.5px;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 4;
                    paint-order: stroke fill;
                  }
                  .logo-fg {
                    fill: currentColor;
                    stroke: #000000;
                    stroke-width: 3.5px;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 4;
                    paint-order: stroke fill;
                  }
                `}
              </style>
            </defs>

            {shadowSteps.map((offset, idx) => (
              <text key={idx} x={10 + offset} y={38 + offset} className="logo-text logo-shadow">
                BALANZA
              </text>
            ))}

            <text x="10" y="38" className="logo-text logo-fg">
              BALANZA
            </text>
          </svg>
        )}
      </span>
    </div>
  );
}

