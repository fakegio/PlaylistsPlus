import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import './popularity.css'

const PopularityRange = () => {
  const storedMinPopularity = parseInt(localStorage.getItem('minPopularity')) || 0;
  const storedMaxPopularity = parseInt(localStorage.getItem('maxPopularity')) || 100;
  const [popularityRange, setPopularityRange] = useState([storedMinPopularity, storedMaxPopularity]);
  const [minInput, setMinInput] = useState(popularityRange[0].toString());
  const [maxInput, setMaxInput] = useState(popularityRange[1].toString());

  const handleSliderChange = (event, newValue) => {
    setPopularityRange(newValue);
    setMinInput(newValue[0].toString());
    setMaxInput(newValue[1].toString());
  };

  const handleMinInputChange = (event) => {
    const value = event.target.value;
    setMinInput(value);
    setPopularityRange([parseInt(value), popularityRange[1]]);
    localStorage.setItem('minPopularity', popularityRange[0].toString());
  };

  const handleMaxInputChange = (event) => {
    const value = event.target.value;
    setMaxInput(value);
    setPopularityRange([popularityRange[0], parseInt(value)]);
    localStorage.setItem('maxPopularity', popularityRange[1].toString());
  };

  const handleBlur = () => {
    setMinInput(popularityRange[0].toString());
    setMaxInput(popularityRange[1].toString());
    // Update localStorage values
    localStorage.setItem('minPopularity', popularityRange[0].toString());
    localStorage.setItem('maxPopularity', popularityRange[1].toString());
  };

  useEffect(() => {
    // Perform additional actions when popularityRange changes
    // ...

    // Update localStorage values when popularityRange changes
    localStorage.setItem('minPopularity', popularityRange[0].toString());
    localStorage.setItem('maxPopularity', popularityRange[1].toString());
  }, [popularityRange]);

  return (
    <div>
      <h1 className="title">Popularity Changer</h1>
      <div className="popularity-range-container">
        <div className="popularity-inputs">
          <p>Min Popularity: {popularityRange[0]}</p>
          <input
            type="text"
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={handleBlur}
          />
        </div>
        <Slider
          min={0}
          max={100}
          value={popularityRange}
          onChange={handleSliderChange}
          style={{ width: '80%', margin: '0 auto', height: '20px' }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
        />
        <div className="popularity-inputs">
          <p>Max Popularity: {popularityRange[1]}</p>
          <input
            type="text"
            value={maxInput}
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
          />
        </div>
        <button className="button" onClick={event => window.location.href='/playlist-gen'}>
          Playlist Generator
        </button>
      </div>
      <p className="note">
        Songs in the higher numbers are not as common, so it may not give you any songs generated.
      </p>
    </div>
  );
};

export default PopularityRange;