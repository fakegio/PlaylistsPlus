import { useState } from "react";

export interface TrackInfo {
  name: string;
  id: string;
  uri: string;
  album: {
    artists: {
      name: string;
    }[];
    images: {
      url: string;
    }[];
  };
}

type Props = {
  selectedTrack: TrackInfo | null;
  trackInfo: TrackInfo;
  handleMenuClick: (track: TrackInfo) => void;
  handleDislike: (trackid: string) => void;
};

export function Track({
  selectedTrack,
  trackInfo,
  handleMenuClick,
  handleDislike,
}: Props) {
  const trackName = trackInfo.name;
  const albumProperties = trackInfo.album;
  const artist = albumProperties.artists[0].name;
  const image = albumProperties.images[0].url;

  const isMenuVisible = selectedTrack?.id === trackInfo.id;

  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDislike(trackInfo.id);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 w-90">
          <img
            src={image}
            alt={trackName + " album cover art"}
            className="h-12 object-cover"
          />
          <div className="flex flex-col justify-evenly ">
            <p className="font-semibold text-black text-xs">{trackName}</p>
            <p className="text-black text-xs">{artist}</p>
          </div>
        </div>
        {isMenuVisible ? (
          <div className="flex flex-col font-light bg-black text-white text-sm rounded-md mr-3 p-2">
            <button onClick={handleDislikeClick}>Dislike artist</button>
            <button onClick={handleDislikeClick}>Dislike song</button>
          </div>
        ) : (
          <span
            className="mr-4 font-semibold cursor-pointer text-lg flex "
            onClick={() => handleMenuClick(trackInfo)}
          >
            ...
          </span>
        )}
      </div>
    </>
  );
}
