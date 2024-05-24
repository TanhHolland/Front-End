import React, { useState } from "react";
import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isMess, setIsMess] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user_name === "" || password === "") {
      setIsMess("Vui lòng điền đầy đủ username và password");
      setIsAlert(true);
      setTimeout(() => {
        setIsAlert(false);
      }, 2000);
      return;
    }
    try {
      const response = await axios.post(
        "https://nzgzhz-8081.csb.app/api/user/register",
        {
          user_name,
          password,
          location,
          description,
          occupation,
        },
      );
      setIsAlert(true);
      setIsMess("Sucess Register");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data._id);
      localStorage.setItem("user_name", response.data.user_name);
      setTimeout(() => {
        setIsAlert(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setIsMess("Account username already exist");
      setIsAlert(true);
      setTimeout(() => {
        setIsAlert(false);
      }, 2000);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 19,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="username"
            variant="standard"
            margin="normal"
            argin="normal"
            required
            fullWidth
            id="user_name"
            name="user_name"
            autoComplete="username"
            autoFocus
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            label="password"
            variant="standard"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="location"
            label="Location"
            name="location"
            autoComplete="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="occupation"
            label="Occupation"
            name="occupation"
            autoComplete="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Login now"}
              </Link>
            </Grid>
          </Grid>
          {isAlert && (
            <Alert
              severity={isMess === "Sucess Register" ? "success" : "error"}
              sx={{ mt: 3, mb: 2 }}
            >
              {isMess}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
