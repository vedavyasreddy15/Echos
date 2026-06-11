import React from 'react';

export default function Logo() {
  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
      
      {/* Simple, clean static pigeon icon sitting above/next to the logo */}
      <svg 
        viewBox="0 0 24 24" 
        width="48" 
        height="48" 
        fill="var(--color-primary)" 
        style={{ position: 'absolute', top: '-25px', right: '10px' }}
      >
        <path d="M21.5,13.5 C21.5,13.5 20.5,14.5 19.5,14.5 C18.5,14.5 17.5,13.5 17.5,13.5 C17.5,13.5 16.5,12.5 15.5,12.5 C14.5,12.5 13.5,13.5 13.5,13.5 C13.5,13.5 12.5,14.5 11.5,14.5 C10.5,14.5 9.5,13.5 9.5,13.5 L5.5,9.5 C4.5,8.5 4.5,7.5 5.5,6.5 C6.5,5.5 7.5,5.5 8.5,6.5 L12.5,10.5 C13.5,11.5 14.5,11.5 15.5,10.5 C16.5,9.5 17.5,9.5 18.5,10.5 C19.5,11.5 20.5,11.5 21.5,10.5 C22.5,9.5 22.5,8.5 21.5,7.5 C20.5,6.5 19.5,6.5 18.5,7.5 L14.5,11.5 C13.5,12.5 12.5,12.5 11.5,11.5 C10.5,10.5 9.5,10.5 8.5,11.5 L4.5,15.5 C3.5,16.5 3.5,17.5 4.5,18.5 C5.5,19.5 6.5,19.5 7.5,18.5 L11.5,14.5 C12.5,13.5 13.5,13.5 14.5,14.5 C15.5,15.5 16.5,15.5 17.5,14.5 C18.5,13.5 19.5,13.5 20.5,14.5 C21.5,15.5 22.5,15.5 23.5,14.5 C24.5,13.5 24.5,12.5 23.5,11.5 C22.5,10.5 21.5,10.5 20.5,11.5 L21.5,13.5 Z" />
        <path d="M 12 2 C 16 2 18 5 18 8 C 18 10 16 11 14 12 C 12 13 8 13 5 12 C 3 11 2 10 2 8 C 2 5 6 2 12 2 Z M 15 6 A 1 1 0 0 0 15 8 A 1 1 0 0 0 15 6 Z" />
      </svg>

      <h1 className="beautiful-text-logo">Echos</h1>
    </div>
  );
}
