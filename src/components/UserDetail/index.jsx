import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://nzgzhz-8081.csb.app/api/user/${userId}`,
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <>
      <h2>Thông tin của {user.user_name}</h2>
      <h3>Tên: {user.user_name}</h3>
      <h3>Địa chỉ: {user.location}</h3>
      <h3>
        Mô tả:{" "}
        <span dangerouslySetInnerHTML={{ __html: user.description }}></span>
      </h3>
      <h3>Nghề nghiệp: {user.occupation}</h3>
      <Link to={`/photos/${userId}`}>
        <Button variant="contained">View Photos</Button>
      </Link>
    </>
  );
}

export default UserDetail;
