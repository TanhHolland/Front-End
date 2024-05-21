import "./App.css";

import React, { useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Register from "./components/Register"; // Import Register component

const Home = () => (
  <div>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <div className="main-topbar-buffer" />
      <Grid item sm={3}>
        <Paper className="main-grid-item">
          <UserList />
        </Paper>
      </Grid>
      <Grid item sm={9}>
        <Paper className="main-grid-item">
          <Routes>
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  </div>
);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      window.location.href = "/login";
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
