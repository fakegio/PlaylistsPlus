"use client"
import { authorize, getToken, login, removeCredentials } from '@/API/authorize';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Header from "./Header";
import SearchBar from "./SearchBar";
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
import Sidebar from './Sidebar'; // Import the Sidebar component




export default function Home() {
  //const [token, setToken] = useState<string | null>("");
  const [token, setToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [codeVerifier, setCodeVerifier] = useState('')
  const [backgroundColors, setBackgroundColors] = useState('');
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
    setToken(sessionStorage.getItem("access_token") || "");
    //setToken = sessionStorage.getItem("access_token");

    if (token){

      getToken
    }


    function getTopArtists(token) {
      console.log("Fetching top artists...");
      spotifyApi.setAccessToken(token);
      spotifyApi.getMyTopArtists({ limit: 10 })
        .then(data => {
          console.log("Top artists data:", data); // Log the data
          setTopArtists(data.items);
        })
        .catch(error => {
          console.error("Error getting top artists:", error);
        });
    }
   
    function getTopTracks(token) {
      console.log("Fetching top tracks...");
      spotifyApi.setAccessToken(token);
      spotifyApi.getMyTopTracks({ limit: 10 })
        .then(data => {
          console.log("Top tracks data:", data); // Log the data
          setTopTracks(data.items);
        })
        .catch(error => {
          console.error("Error getting top tracks:", error);
        }); 
     }

  
     function getArtistProfile(artistId) {
      spotifyApi.getArtist(artistId)
        .then((data) => {
          setArtist(data);
        })
        .catch((error) => {
          console.error("Error getting artist data:", error);
        });
    }
  


    
    if (!token) {
      // Token is not available, handle this case
      // You can redirect to the login page or display a message
      // indicating that the user needs to log in.
      console.error('Token not available. Redirecting to login...');
      setToken();
      // Example: redirect to the login page
      //window.location.href = '/login'; // Update with your login route
      } else{
        getTopArtists(token); // Fetch top artists
        getTopTracks(token); // Fetch top tracks
        getArtistProfile(token);
      }
      
    


    
    const storedBackgroundColors = localStorage.getItem('selectedBackgroundColor');
    if (storedBackgroundColors) {
      setBackgroundColors(storedBackgroundColors);
    }


  }, []);
  

 

  






  // Function to handle artist search
  const handleSearch = (query) => {
    spotifyApi.searchArtists(query)
      .then((data) => {
        // Update the searchResults state with the search results
        setSearchResults(data.artists.items);
      })
      .catch((error) => {
        console.error("Error searching for artists:", error);
      });
  };
  // ... your JSX rendering ...
  <div className="search-results">
    {searchResults.map((artist) => (
      <div key={artist.id}>{artist.name}</div>
    ))}
  </div>

const artistProfileSection = artist && (
  <div className="artist-profile">
    <h2>Artist Profile</h2>
    <h3>{artist.name}</h3>
    {artist.images.length > 0 && (
      <img src={artist.images[0].url} alt={artist.name} />
    )}
    <p>{artist.genres.join(', ')}</p>
    {/* Add more details as needed */}
  </div>
);

const artistPopularitySection = artist && (
  <div className="artist-popularity">
    <h2>Artist Popularity</h2>
    <h3>{artist.name}</h3>
    <p>Popularity: {artist.popularity}%</p>
  </div>
);

const handleArtistSelect = (artistId) => {
  // Fetch artist popularity
  spotifyApi.getArtist(artistId)
    .then((data) => {
      setArtist(data);
    })
    .catch((error) => {
      console.error("Error getting artist data:", error);
    });
  };






return (
  <div className="app">
    <Sidebar /> {/* Include the Sidebar component here */}
    <Header />
    <div className="center">
      <SearchBar onSearch={handleSearch} />
    </div>
    <div className="button-container">
      <button className="button">Mood Sync</button>
      <button className="button">Playlist Generator</button>
      <button className="button">Joint Playlist</button>
      <button className="button">Liked/Dislike Songs</button>
    </div>
    <div className="analytics-header">
      <h2>Analytics</h2>
      {/* Add content related to analytics here */}
    </div>

    <div className="right-content">
      <div className="top-artists textbox"> Top Artists</div>
      <h2>Top Artists</h2>
      <ul>
        {topArtists.map((artist) => (
          <li 
          key={artist.id} 
          className="red-text"
          onClick={() => handleArtistSelect(artist.id)}>  
          {artist.name}
          </li>
        ))}
      </ul>


      {artistProfileSection}
      {artistPopularitySection}
    


      <div className="top-genres textbox">Top Tracks</div>
      <h2>Top Tracks</h2>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id} className="white-text">
            {track.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}