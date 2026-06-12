import { useEffect } from 'react';
import './SealAnimation.css';

function SealAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds of animation
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="seal-overlay">
      <div className="envelope">
        <div className="flap"></div>
        <div className="wax-seal">
          <div className="stamp"></div>
        </div>
      </div>
      <h2 className="sealing-text">Sealing your legacy...</h2>
    </div>
  );
}

export default SealAnimation;
