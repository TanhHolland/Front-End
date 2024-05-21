import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [userName, setUserName] = useState("");
  const user_name = localStorage.getItem("user_name");
  useEffect(() => {
    console.log("Pathname:", pathname);
    const fetchData = async () => {
      try {
        // Extract userId from pathname
        const userId = getUserIdFromPathname(pathname);
        console.log("User Id:", userId);
        if (userId) {
          const response = await axios.get(
            `https://9mlf5s-8081.csb.app/api/user/${userId}`
          );
          console.log("User data:", response.data);
          setUserName(response.data.user_name);
        } else {
          // Set userName to null or another value if pathname contains "/photos/"
          setUserName(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [pathname]);

  const getUserIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    console.log("Parts:", parts);
    const userIdIndex = parts.findIndex((part) => part === "users" || part === "photos");
    if (userIdIndex !== -1 && userIdIndex + 1 < parts.length) {
      return parts[userIdIndex + 1];
    }
    
    return null;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  let appContext = "";

  if (pathname.startsWith("/users/")) {
    appContext = `Thông tin của ${userName || "Người dùng"}`;
  } else if (pathname.startsWith("/photos/")) {
    appContext = `Ảnh của ${userName || "Người dùng"}`;
  } else if (pathname === "/") {
    appContext = "Cùng khám phá ảnh mọi người nhé";
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        { user_name && (
          <Typography variant="h6" color="inherit">
            Xin chào {user_name}
          </Typography>
        )}
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h6" color="inherit">
            {appContext}
          </Typography>
        </Box>
        <Button color="inherit" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
