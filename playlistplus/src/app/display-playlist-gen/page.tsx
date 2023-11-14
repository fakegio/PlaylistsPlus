"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import { TrackInfo } from "./Track";
import { Track } from "./Track";

export default function PlaylistResults() {
  const [tracks, setTracks] = useState<TrackInfo[] | null>([]);
  const [title, setTitle] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null);
  const [token, setToken] = useState<string | null>("");

  let userID: string | undefined;
  let playlist_id: string;
  let playlist_link: string;

  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("PlaylistData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setTitle(data[0]);
        setTracks(data[1]);
      } else {
        console.log("Data not received from display page");
      }
    }
  }, []);

  const handleMenuClick = (track: TrackInfo) => {
    setSelectedTrack(track);
  };

  const handleDislikeArtist = (trackId: string, artistID: string) => {
    // Retrieve the value from session storage, considering it could be null
    let storedValue: string | null = sessionStorage.getItem("dislikedArtists");
    if (storedValue) {
      let parsedArray: string[] = JSON.parse(storedValue);
      parsedArray.push(artistID);
      sessionStorage.setItem("dislikedArtists", JSON.stringify(parsedArray));
    } else {
      let newArray: string[] = [artistID];
      sessionStorage.setItem("dislikedArtists", JSON.stringify(newArray));
    }

    setTracks((prevTracks) =>
      prevTracks ? prevTracks.filter((track) => track.id !== trackId) : null
    );
    const data = [title, tracks];
    const dataString = JSON.stringify(data);
    sessionStorage.setItem("PlaylistData", dataString);
  };

  const handleDislikeTrack = (trackId: string) => {
    let storedValue: string | null = sessionStorage.getItem("dislikedTracks");
    if (storedValue) {
      let parsedArray: string[] = JSON.parse(storedValue);
      parsedArray.push(trackId);
      sessionStorage.setItem("dislikedTracks", JSON.stringify(parsedArray));
    } else {
      let newArray: string[] = [trackId];
      sessionStorage.setItem("dislikedTracks", JSON.stringify(newArray));
    }
    setTracks((prevTracks) =>
      prevTracks ? prevTracks.filter((track) => track.id !== trackId) : null
    );
    const data = [title, tracks];
    const dataString = JSON.stringify(data);
    sessionStorage.setItem("PlaylistData", dataString);
  };

  function getUserID() {
    if (token) {
      const url = "https://api.spotify.com/v1/me";
      const queryParameters = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(url, queryParameters)
        .then((response) => response.json())
        .then((data) => {
          userID = data.id;
          console.log("User ID:" + userID);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }
  function getTracksURI() {
    if (tracks) {
      return tracks.map((track) => track.uri);
    }
    return [];
  }

  function createPlaylist(userID: string) {
    if (userID) {
      let queryParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: title,
        }),
      };
      let url = `https://api.spotify.com/v1/users/${userID}/playlists`;
      fetch(url, queryParameters)
        .then((response) => response.json())
        .then((data) => {
          let playlist_id = data.id;
          let playlist_link = data.external_urls.spotify;
          console.log("The playlist link is " + playlist_link);
          console.log("Create playlist " + data);
          addToPlaylist(playlist_id, playlist_link);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }

  function addToPlaylist(playlistID: string, playlist_link: string) {
    const track_uris = getTracksURI();
    let queryParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        uris: track_uris,
      }),
    };
    let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    fetch(url, queryParameters)
      .then((response) => response.json())
      .then((data) => {
        window.open(playlist_link, "_blank");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  getUserID();
  return (
    <>
      <main className="min-h-screen overflow-hidden flex flex-col items-center gap-20">
        <h1 className="text-white text-6xl font-semibold text-center pt-10 h-16">
          {title && title}
        </h1>
        {/* Container for tracks */}
        <div className="bg-zinc-200 rounded-lg w-4/12 flex flex-col gap-3 pl-4 py-4 ">
          {tracks ? (
            tracks.map((track) => (
              <Track
                key={track.name}
                trackInfo={track}
                selectedTrack={selectedTrack}
                handleMenuClick={handleMenuClick}
                handleDislikeArtist={handleDislikeArtist}
                handleDislikeTrack={handleDislikeTrack}
              />
            ))
          ) : (
            <div className="text-lg font-bold text-center">Loading...</div>
          )}
          <div className="flex flex-wrap justify-evenly mt-2 ">
            <button
              className="bg-green-500 rounded-lg px-4 py-2 font-bold"
              onClick={() => (window.location.href = "playlist-gen")}
            >
              Regenerate
            </button>
            <button
              className="bg-green-500 rounded-lg px-4 py-2 font-bold"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault(); // Prevents the default action
                if (userID) {
                  createPlaylist(userID); // Call your function here with the userID
                } else {
                  console.log("No user id");
                }
              }}
            >
              View on Spotify
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
