import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  ListItemAvatar,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("user_id");
  const loggedInUserName = localStorage.getItem("user_name");

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://9mlf5s-8081.csb.app/api/user/list"
        );
        let fetchedUsers = response.data.users;

        // Find and move the logged-in user to the top of the list
        fetchedUsers = fetchedUsers.map((user) =>
          user._id === loggedInUserId
            ? { ...user, user_name: `Bạn (${loggedInUserName})` }
            : user
        );

        fetchedUsers.sort((a, b) =>
          a._id === loggedInUserId ? -1 : b._id === loggedInUserId ? 1 : 0
        );

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [loggedInUserId, loggedInUserName]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="body1" gutterBottom>
        Đây là danh sách người dùng của chúng tôi, bạn hãy cùng khám phá nhé
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem
              alignItems="flex-start"
              style={{
                backgroundColor:
                  user._id === loggedInUserId ? "#ffeb3b" : "inherit",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.user_name}
                  src={`/path/to/avatars/${user._id}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.user_name}
                secondary={
                  <>
                    <Link
                      to={`/users/${user._id}`}
                      style={{
                        textDecoration: "none",
                        marginRight: "10px",
                        color: "#3f51b5",
                      }}
                    >
                      Thông tin
                    </Link>
                    <Link
                      to={`/photos/${user._id}`}
                      style={{ textDecoration: "none", color: "#3f51b5" }}
                    >
                      Ảnh
                    </Link>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default UserList;
