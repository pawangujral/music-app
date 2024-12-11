import React, { useState, useEffect } from "react";
import TrackRow from "./../tracks/TrackRow";
import AudioPlayer from "./../tracks/AudioPlayer";
import { useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import Alert from "@mui/material/Alert";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

function Details() {
  let params = useParams(); // Get URL parameters
  let navigate = useNavigate(); // Hook to navigate programmatically

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
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
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
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
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
        enqueueSnackbar("Track removed from playlist", {
          variant: "warning",
        });
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress /> {/* Show loading spinner */}
      </Box>
    );
  }

  if (!tracks.length) {
    return (
      <Alert
        icon={<MusicNoteIcon fontSize="inherit" />}
        severity="warning"
        variant="outlined"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate("/tracks")}
          >
            Go to tracks!
          </Button>
        }
      >
        Your playlist is empty. Add some tracks to get started!
      </Alert>
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
