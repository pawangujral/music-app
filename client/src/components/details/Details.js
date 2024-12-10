import React, { useState, useEffect } from "react";
import TrackRow from "./../tracks/TrackRow";
import AudioPlayer from "./../tracks/AudioPlayer";
import { useParams } from "react-router";

function Details() {
  let params = useParams();

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [playlist, setPlaylist] = useState();

  const getTracks = (id) => {
    if (!id) {
      return;
    }
    fetch(`/api/v1/tracks/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { track } = data;
        setTracks((prev) => [...prev, track]);
      });
  };

  const getPlaylist = () => {
    fetch(`/api/v1/playlists/${params.id}`, { method: "GET" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlist } = data;
        setPlaylist(playlist);
      });
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  useEffect(() => {
    if (playlist && playlist.tracks.length) {
      setTracks([]);
      playlist.tracks.forEach((trackId) => getTracks(trackId));
    }
  }, [playlist]);

  const handlePlay = (track) => {
    setCurrentTrack(track);
  };

  const handleTrackDelete = (trackId) => {
    const filterTracks = playlist.tracks.filter((id) => id !== trackId);
    const updatedPlaylist = { ...playlist, tracks: filterTracks };

    fetch(`/api/v1/playlists/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlaylist),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        getPlaylist();
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
            playlists={[playlist]}
            onDelete={handleTrackDelete}
            onFetchTracks={getTracks}
          />
        ))}
      </div>
      {currentTrack && <AudioPlayer track={currentTrack} />}
    </>
  );
}

export default Details;
