import React from "react";
import styles from "./App.module.css";
import logo from "./assets/logo.svg";
import { Routes, Route } from "react-router";
import Tracks from "./../src/components/tracks/Tracks";
import Playlists from "./../src/components/playlists/Playlists";
import Details from "./../src/components/details/Details";

import { NavLink } from "react-router";

function App() {
  return (
    <>
      <main className={styles.app}>
        <nav>
          <img src={logo} className={styles.logo} alt="Logo" />
          <ul className={styles.menu}>
            <li>
              <NavLink
                to="/tracks"
                className={({ isActive }) => (isActive ? styles.active : null)}
              >
                Tracks
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/playlists"
                className={({ isActive }) => (isActive ? styles.active : null)}
              >
                Playlists
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<Details />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
