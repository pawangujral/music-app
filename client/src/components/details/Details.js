import React, { useState, useEffect } from "react";
import TrackRow from "./../tracks/TrackRow";
import AudioPlayer from "./../tracks/AudioPlayer";
import { useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Details() {
  let params = useParams(); // Get URL parameters

  const [tracks, setTracks] = useState([]); // State to store tracks
  const [currentTrack, setCurrentTrack] = useState(); // State to store the currently playing track
  const [playlist, setPlaylist] = useState(); // State to store the playlist
  const [loading, setLoading] = useState(true); // State to manage loading state

  const getTracks = (id) => {
    if (!id) {
      return;
    }
    fetch(`/api/v1/tracks/${id}`) // Fetch track details by ID
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { track } = data;
        setTracks((prev) => [...prev, track]); // Add track to the state
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching
      });
  };

  const getPlaylist = () => {
    setLoading(true); // Set loading to true before fetching
    fetch(`/api/v1/playlists/${params.id}`, { method: "GET" }) // Fetch playlist details by ID
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlist } = data;
        setPlaylist(playlist); // Set playlist to the state
      });
  };

  useEffect(() => {
    getPlaylist(); // Fetch playlist when component mounts
  }, []);

  useEffect(() => {
    if (playlist && playlist.tracks.length) {
      setTracks([]); // Clear tracks before fetching new ones
      playlist.tracks.forEach((trackId) => getTracks(trackId)); // Fetch each track in the playlist
    }
  }, [playlist]);

  const handlePlay = (track) => {
    setCurrentTrack(track); // Set the currently playing track
  };

  const handleTrackDelete = (trackId) => {
    const filterTracks = playlist.tracks.filter((id) => id !== trackId); // Filter out the deleted track
    const updatedPlaylist = { ...playlist, tracks: filterTracks };

    fetch(`/api/v1/playlists/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlaylist), // Update playlist on the server
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setTracks(tracks.filter((track) => track.id !== trackId)); // Update tracks state after deletion
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress /> {/* Show loading spinner */}
      </Box>
    );
  }

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
      {currentTrack && <AudioPlayer track={currentTrack} />}{" "}
      {/* Show audio player if a track is selected */}
    </>
  );
}

export default Details;
