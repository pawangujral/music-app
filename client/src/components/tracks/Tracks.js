import React, { useState, useEffect } from "react";
import TrackRow from "./TrackRow";
import AudioPlayer from "./AudioPlayer";
import List from "@mui/material/List";
import SimpleDialog from "./SimpleDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Tracks() {
  // State variables
  const [open, setOpen] = useState(false); // Dialog open state
  const [tracks, setTracks] = useState([]); // List of tracks
  const [currentTrack, setCurrentTrack] = useState(); // Currently playing track
  const [playlists, setPlaylists] = useState([]); // List of playlists
  const [selectedValue, setSelectedValue] = useState(); // Selected playlist value
  const [selectedTrack, setSelectedTrack] = useState(); // Track selected to add to playlist
  const [showNotify, setShowNotify] = useState(false); // Snackbar open state

  // Fetch tracks from API
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

  // Fetch playlists from API
  const fetchPlaylists = () => {
    fetch("/api/v1/playlists")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlists } = data;
        setPlaylists(playlists);
      });
  };

  // Fetch tracks and playlists on component mount
  useEffect(() => {
    getTracks();
    fetchPlaylists();
  }, []);

  // Handle play button click
  const handlePlay = (track) => {
    setCurrentTrack(track);
  };

  const updateList = (id, payload) => {
    fetch(`/api/v1/playlists/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(() => {
        fetchPlaylists();
        setShowNotify(true);
        setOpen(false);
      });
  };

  // Handle adding track to playlist
  const handleAddToPlaylist = (playlistData) => {
    const updatedPlaylist = {
      ...playlistData,
      tracks: [...playlistData.tracks, selectedTrack],
    };

    updateList(playlistData.id, updatedPlaylist);
  };

  // Handle delete track to playlist
  const handleDeleteToPlaylist = (trackId, playlistId) => {
    const findPlaylist = playlists.find(
      (playlist) => playlist.id === playlistId
    );

    const filterTracks = findPlaylist.tracks.filter((id) => id !== trackId);

    const updatedPlaylist = { ...findPlaylist, tracks: filterTracks };

    updateList(playlistId, updatedPlaylist);
  };

  // Handle dialog close
  const handleDialogClose = (value) => {
    setSelectedValue(value);
    handleAddToPlaylist(value);
  };

  // Handle dialog open
  const handleDialogOpen = (id) => {
    setSelectedTrack(id);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {/* List of tracks */}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {tracks.map((track, ix) => (
          <TrackRow
            key={ix}
            track={track}
            handlePlay={handlePlay}
            playlists={playlists}
            onOpen={handleDialogOpen}
            onDelete={handleDeleteToPlaylist}
          />
        ))}
      </List>
      {/* Dialog for selecting playlist */}
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleDialogClose}
        data={playlists}
      />
      <Snackbar open={showNotify} autoHideDuration={1200} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully added to playlist!
        </Alert>
      </Snackbar>
      {/* Audio player for current track */}
      {currentTrack && <AudioPlayer track={currentTrack} />}
    </>
  );
}

export default Tracks;
