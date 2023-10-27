import React, { useState, useEffect } from 'react';
import '@/app/globals.css'

function ColorChanger() {
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedBackgroundColor = localStorage.getItem('selectedBackgroundColor') || '';

      setBackgroundColor(selectedBackgroundColor);

      // Update the CSS variable when the color changes
      document.documentElement.style.setProperty('--background-color', selectedBackgroundColor);
    }
  }, []);

  const handleBackgroundColorChange = (e) => {
    const color = e.target.value;
    setBackgroundColor(color);

    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBackgroundColor', color);

      // Update the CSS variable when the color changes
      document.documentElement.style.setProperty('--background-color', color);
    }
  };

  return (
    <div style={{ backgroundColor: backgroundColor, color: 'white', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div className="color-inputs" style={{backgroundColor: backgroundColor, display: 'flex', justifyContent: 'center', color: "textColor", position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%'}}>
        <label htmlFor="backgroundColor">Change background color</label>
        <input type="color" id="backgroundColor" value={backgroundColor} onChange={handleBackgroundColorChange} />
      </div>
    </div>
  );
}

export default ColorChanger;