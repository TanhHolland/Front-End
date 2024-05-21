import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
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
        const response = await axios.get(`https://9mlf5s-8081.csb.app/api/user/${userId}`);
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
      <Typography variant="body1">
        Thông tin của người dùng
      </Typography>
      <strong>Tên:</strong> {user.user_name} <br />
      <strong>Địa chỉ:</strong> {user.location}<br />
      <strong>Mô tả:</strong> <span dangerouslySetInnerHTML={{ __html: user.description }}></span><br />
      <strong>Nghề nghiệp:</strong> {user.occupation}
    </>
  );
}

export default UserDetail;
