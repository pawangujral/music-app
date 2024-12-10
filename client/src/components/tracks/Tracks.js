import React, { useState, useEffect } from "react";
import TrackRow from "./TrackRow";
import AudioPlayer from "./AudioPlayer";

function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [playlists, setPlaylists] = useState([]);

  const getTracks = () => {
    fetch("/api/v1/tracks")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { tracks } = data;
        setTracks(tracks);
      });
  };

  useEffect(() => {
    fetch("/api/v1/playlists")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlists } = data;
        setPlaylists(playlists);
      });
  }, []);

  useEffect(() => {
    getTracks();
  }, []);

  const handlePlay = (track) => {
    setCurrentTrack(track);
  };

  const handleAddToPlaylist = (selectedPlaylistId, trackId) => {
    let updatedPlaylist = [];

    if (selectedPlaylistId === "") {
      const findPlaylist = playlists.find((playlist) =>
        playlist.tracks.includes(trackId)
      );

      updatedPlaylist = [
        {
          ...findPlaylist,
          tracks: findPlaylist.tracks.filter((track) => track !== trackId),
        },
      ];
    } else {
      updatedPlaylist = playlists.filter(
        (playlist) => playlist.id === selectedPlaylistId
      );
      updatedPlaylist[0].tracks.push(trackId);
    }

    fetch(`/api/v1/playlists/${selectedPlaylistId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlaylist[0]),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        getTracks();
        console.log("success", data.playlist.tracks);
      });
  };

  return (
    <>
      <div>
        {tracks.map((track, ix) => (
          <TrackRow
            key={ix}
            track={track}
            handlePlay={handlePlay}
            playlists={playlists}
            onSaved={handleAddToPlaylist}
            onFetchTracks={getTracks}
          />
        ))}
      </div>
      {currentTrack && <AudioPlayer track={currentTrack} />}
    </>
  );
}

export default Tracks;
