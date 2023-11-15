export interface TrackInfo {
  name: string;
  id: string;
  uri: string;
  album: {
    artists: {
      name: string;
      id: string;
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
  handleDislikeArtist: (trackid: string, artistID: string) => void;
  handleDislikeTrack: (trackid: string) => void;
};

export function Track({
  selectedTrack,
  trackInfo,
  handleMenuClick,
  handleDislikeArtist,
  handleDislikeTrack,
}: Props) {
  const trackName = trackInfo.name;
  const albumProperties = trackInfo.album;
  const artist = albumProperties.artists[0].name;
  const artistID = albumProperties.artists[0].id;
  const image = albumProperties.images[0].url;

  const isMenuVisible = selectedTrack?.id === trackInfo.id;

  const handleDislikeClickArtist = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDislikeArtist(trackInfo.id, artistID);
  };

  const handleDislikeClickTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDislikeTrack(trackInfo.id);
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
            <button onClick={handleDislikeClickArtist}>Dislike artist</button>
            <button onClick={handleDislikeClickTrack}>Dislike song</button>
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
