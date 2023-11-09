import { ChangeEvent, useEffect, useState } from "react";
//Interfaces so I can filter out compilation tracks
interface Artist {
  name: string;
}

interface Track {
  album: {
    album_type: string;
  };
  artists: Array<Artist>;
}

interface TrackObj {
  tracks: Array<Track>;
}

export function Search({ typeOfPlaylist }: { typeOfPlaylist: string }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermID, setSearchTermID] = useState<string>("");
  const [token, setToken] = useState<string | null>("");
  const [results, setResults] = useState<Array<{ name: string; id: string }>>(
    []
  );
  const genreSeeds: string[] = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indonesian",
    "industrial",
    "instrumental",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rap",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music",
  ];

  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  //When the search bar changes, searches the Spotify database as long as the term being searched for is not a genre type
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (searchTerm && typeOfPlaylist !== "Genre") {
      let queryParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      let url =
        "https://api.spotify.com/v1/search?q=" +
        searchTerm +
        "&type=" +
        typeOfPlaylist.toLowerCase() +
        "&limit=50";

      fetch(url, queryParameters)
        .then((response) => response.json())
        .then((data) => {
          if (typeOfPlaylist === "Artist") {
            setResults(data.artists.items);
          } else if (typeOfPlaylist === "Track") {
            setResults(data.tracks.items);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  function filterCompilationAlbums(trackObj: TrackObj) {
    const listOfTracks = trackObj.tracks;
    const filteredTracks = [];
    let count = 0;

    for (let i = 0; i < listOfTracks.length; i++) {
      const track = listOfTracks[i];
      if (
        track.album.album_type !== "COMPILATION" &&
        track.artists[0].name !== searchTerm
      ) {
        filteredTracks.push(track);
        count++;
      }

      if (count === 10) {
        break; // Stop when you have 10 tracks
      }
    }

    return filteredTracks;
  }

  //Handles form submission
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here, e.g., make API calls, perform data processing, etc.
    let form = e.target as HTMLFormElement;
    let checkboxElement = form.children[2].children[0] as HTMLInputElement;

    if (checkboxElement.checked) {
      let queryParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      let url = "";
      let playlistTitle = "New";

      if (typeOfPlaylist === "Genre") {
        playlistTitle = "Genre Explorer: " + searchTerm;
        url =
          "https://api.spotify.com/v1/recommendations?seed_genres=" +
          searchTerm +
          "&max_popularity=50&limit=40";
      } else if (typeOfPlaylist === "Track") {
        playlistTitle = "Song Roulette: " + searchTerm;
        url =
          "https://api.spotify.com/v1/recommendations?seed_tracks=" +
          searchTermID +
          "&max_popularity=50&limit=40";
      } else {
        playlistTitle = "Artist Spotlight: " + searchTerm;
        url =
          "https://api.spotify.com/v1/recommendations?seed_artists=" +
          searchTermID +
          "&max_popularity=50&limit=40";
      }
      fetch(url, queryParameters)
        .then((response) => response.json())
        .then((data) => {
          const filteredData = filterCompilationAlbums(data);
          if (typeof window !== "undefined") {
            const data = [playlistTitle, filteredData];
            const dataString = JSON.stringify(data);
            sessionStorage.setItem("PlaylistData", dataString);
            window.location.href = `/display-playlist-gen`;
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  //Only for track and artist playlist generators
  //Renders available artists/tracks on Spotify
  function renderSpotifySearchResults() {
    return results
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        const fullName = item.name.toLowerCase();
        return term && fullName.startsWith(term) && fullName !== term;
      })
      .slice(0, 8)
      .map((item) => (
        <div
          onClick={() => {
            setSearchTerm(item.name);
            setSearchTermID(item.id);
          }}
          className="cursor-pointer text-left"
          key={item.id}
        >
          {item.name}
        </div>
      ));
  }

  //Renders available genres using the genreSeeds array
  function renderSpotifyGenreResults() {
    return genreSeeds
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        return term && item.startsWith(term) && item !== term;
      })
      .slice(0, 8)
      .map((item) => (
        <div
          onClick={() => setSearchTerm(item)}
          className="cursor-pointer text-left"
          key={item}
        >
          {item}
        </div>
      ));
  }

  return (
    <>
      <label htmlFor="search-form">{typeOfPlaylist}</label>
      <form
        action="#"
        name="search-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          className="bg-white rounded-md"
          type="text"
          name="text"
          id="text"
          placeholder={"Search " + typeOfPlaylist + "s..."}
          value={searchTerm}
          onChange={
            typeOfPlaylist !== "Genre"
              ? handleInputChange
              : (e) => setSearchTerm(e.target.value)
          }
        />
        <div className="bg-white flex flex-col">
          {typeOfPlaylist !== "Genre"
            ? renderSpotifySearchResults()
            : renderSpotifyGenreResults()}
        </div>
        <label htmlFor={typeOfPlaylist}>
          {" "}
          <input
            className="mr-2 form-checkbox text-white"
            type="checkbox"
            name={typeOfPlaylist}
            id={typeOfPlaylist}
          />
          Utilize listening patterns
        </label>
        <button
          className="bg-green-500 rounded-lg px-4 py-2 font-bold"
          type="submit"
          disabled={!searchTerm}
        >
          Create Playlist
        </button>
      </form>
    </>
  );
}
