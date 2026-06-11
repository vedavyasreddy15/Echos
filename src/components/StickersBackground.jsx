import React, { useMemo } from 'react';

const stickerTypes = [
  {
    // Lovers / Heart
    color: '#ff7675',
    svg: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  },
  {
    // Video
    color: '#e84393',
    svg: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  },
  {
    // Pictures / Photography
    color: '#0984e3',
    svg: <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  },
  {
    // Family (People)
    color: '#fab1a0',
    svg: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  },
  {
    // Envelope / Letter
    color: '#fdcb6e',
    svg: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  },
  {
    // Music
    color: '#a29bfe',
    svg: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  },
  {
    // Clock
    color: '#55efc4',
    svg: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  }
];

export default function StickersBackground() {
  // Generate a large number of stickers to fill the massive rolling background container
  const generatedStickers = useMemo(() => {
    const stickers = [];
    for (let i = 0; i < 150; i++) {
      const type = stickerTypes[Math.floor(Math.random() * stickerTypes.length)];
      const top = Math.random() * 200; // Spread across 200vw/200vh
      const left = Math.random() * 200;
      const rotation = Math.random() * 360;
      
      stickers.push(
        <div 
          key={i} 
          className="sticker-icon" 
          style={{ top: `${top}%`, left: `${left}%`, transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 24 24" fill={type.color} width="50" height="50">
            {type.svg}
          </svg>
        </div>
      );
    }
    return stickers;
  }, []);

  return (
    <div className="stickers-background">
      {generatedStickers}
    </div>
  );
}
