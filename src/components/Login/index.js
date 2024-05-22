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

export default function Login() {
  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isMess, setIsMess] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://nzgzhz-8081.csb.app/api/user/login",
        { user_name, password },
      );
      setIsAlert(true);
      setIsMess("Sucess");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data._id);
      localStorage.setItem("user_name", response.data.user_name);
      setIsMess("Sucess");
      setTimeout(() => {
        setIsAlert(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      setIsMess("Failed");
      setIsAlert(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="username"
            variant="standard"
            margin="normal"
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
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Register"}
              </Link>
            </Grid>
          </Grid>
          {isAlert && (
            <Alert
              severity={isMess === "Sucess" ? "success" : "error"}
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
