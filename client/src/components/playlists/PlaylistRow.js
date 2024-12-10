import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router";
import Grid from "@mui/material/Grid2";

// Component to display a playlist row
function PlaylistRow({ playlist, onTrackDelete }) {
  let navigate = useNavigate(); // Hook to navigate programmatically

  const [previewTrack, setPreviewTrack] = useState(); // State to store the preview track

  // Function to fetch tracks by ID
  const getTracks = (id) => {
    fetch(`/api/v1/tracks/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPreviewTrack(data.track); // Set the preview track state
      });
  };

  // Effect to fetch the first track of the playlist when the playlist changes
  useEffect(() => {
    if (playlist && playlist.tracks.length) {
      getTracks(playlist.tracks[0]);
    }
  }, [playlist]);

  return (
    <Grid size={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={() => navigate(`/playlists/${playlist.id}`)}>
          <CardMedia
            sx={{ height: 140 }}
            image={previewTrack?.cover_art} // Display the cover art of the preview track
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {playlist.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Total tracks: {playlist.tracks.length}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from propagating to the CardActionArea
                onTrackDelete(playlist.id); // Call the onTrackDelete function with the playlist ID
              }}
            >
              Delete
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default PlaylistRow;
