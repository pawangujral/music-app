import React from "react";
import styles from "./App.module.css";
import logo from "./assets/logo.svg";
import { Routes, Route, NavLink, Navigate } from "react-router";
import Tracks from "./../src/components/tracks/Tracks";
import Playlists from "./../src/components/playlists/Playlists";
import Details from "./../src/components/details/Details";
import { SnackbarProvider } from "notistack";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  return (
    <SnackbarProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main className={styles.app}>
          <nav>
            <img src={logo} className={styles.logo} alt="Logo" />
            <ul className={styles.menu}>
              <li>
                <NavLink
                  to="/tracks"
                  className={({ isActive }) =>
                    isActive ? styles.active : null
                  }
                >
                  Tracks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/playlists"
                  className={({ isActive }) =>
                    isActive ? styles.active : null
                  }
                >
                  Playlists
                </NavLink>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route exact path="/" element={<Navigate to="/tracks" />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<Details />} />
          </Routes>
        </main>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
