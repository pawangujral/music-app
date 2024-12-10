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

function PlaylistRow({ playlist, onTrackDelete }) {
  let navigate = useNavigate();

  const [previewTrack, setPreviewTrack] = useState();

  const getTracks = (id) => {
    fetch(`/api/v1/tracks/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPreviewTrack(data.track);
      });
  };

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
            image={previewTrack?.cover_art}
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
                e.stopPropagation();
                onTrackDelete(playlist.id);
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
