import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const UserPhotos = () => {
  const { userId } = useParams();
  const loggedInUserId = localStorage.getItem("user_id");
  const [photos, setPhotos] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://9mlf5s-8081.csb.app/api/photo/photosOfUser/${userId}`
        );
        setPhotos(response.data);
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Không tìm thấy ảnh của người này 😢");
        } else {
          console.error("Error fetching photos:", error);
        }
      }
    };

    fetchPhotos();
  }, [userId]);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async (photoId) => {
    try {
      const userId = localStorage.getItem("user_id");
      const userName = localStorage.getItem("user_name");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://9mlf5s-8081.csb.app/api/photo/${photoId}/comments`,
        { comment: commentText, user_id: userId, user_name: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the photos state to reflect the new comment
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo._id === photoId ? response.data : photo
        )
      );

      setCommentText(""); // Clear the comment input field
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setUploadError("Vui lòng chọn một file để tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://9mlf5s-8081.csb.app/api/photo/uploadPhoto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new photo to the photos state
      setPhotos((prevPhotos) => [response.data, ...prevPhotos]);
      setSelectedFile(null); // Clear the file input field
      setUploadError(null); // Clear any previous upload errors
    } catch (error) {
      console.error("Error uploading photo:", error);
      setUploadError("Có lỗi xảy ra khi tải lên ảnh.");
    }
  };

  return (
    <div>
      <Typography variant="body1">
        Đây là trang xem ảnh của người dùng trong ứng dụng PhotoShare.
      </Typography>
      {userId === loggedInUserId && (
        <Card variant="outlined" style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h6">Tải lên ảnh mới</Typography>
            <input type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePhotoUpload}
              style={{ marginTop: "10px" }}
            >
              Tải lên ảnh
            </Button>
            {uploadError && <Alert severity="error">{uploadError}</Alert>}
          </CardContent>
        </Card>
      )}
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : photos.length > 0 ? (
        photos.map((photo) => (
          <Photo
            key={photo._id}
            photo={photo}
            onCommentSubmit={handleCommentSubmit}
            onCommentChange={handleCommentChange}
            commentText={commentText}
            showAllComments={showAllComments}
            setShowAllComments={setShowAllComments}
          />
        ))
      ) : (
        <Typography variant="body1">
          Người dùng hiện tại chưa đăng bức ảnh nào.
        </Typography>
      )}
    </div>
  );
};

const Photo = ({
  photo,
  onCommentSubmit,
  onCommentChange,
  commentText,
  showAllComments,
  setShowAllComments,
}) => {
  const { _id, date_time, file_name, comments } = photo;

  const visibleComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <Card variant="outlined" style={{ marginBottom: "20px" }}>
      <CardContent>
        <Typography variant="h6">Chi tiết ảnh</Typography>
        <Typography>
          <strong>Ngày đăng:</strong> {new Date(date_time).toLocaleString()}
        </Typography>
        <img
          src={`https://9mlf5s-8081.csb.app/uploads/${file_name}`}
          alt="Ảnh"
          style={{
            maxWidth: "100%",
            marginTop: "10px",
            maxHeight: "300px",
            objectFit: "cover",
          }}
        />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Bình luận:
        </Typography>
        {visibleComments && visibleComments.length > 0 ? (
          <List>
            {visibleComments.map((comment) => (
              <ListItem key={comment._id} alignItems="flex-start">
                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                  {comment.user_name ? comment.user_name[0].toUpperCase() : "?"}
                </Avatar>
                <ListItemText
                  primary={<strong>{comment.user_name || "Anonymous"}</strong>}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(comment.date_time).toLocaleString()}
                      </Typography>
                      <br />
                      {comment.comment}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Chưa có bình luận nào.</Typography>
        )}
        {!showAllComments && comments.length > 3 && (
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => setShowAllComments(true)}
          >
            Hiển thị thêm bình luận ({comments.length})
          </MuiLink>
        )}
        <TextField
          label="Bình luận"
          variant="outlined"
          value={commentText}
          onChange={onCommentChange}
          fullWidth
          multiline
          rows={3}
          style={{ marginTop: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => onCommentSubmit(_id)}
          style={{ marginTop: "10px" }}
        >
          Gửi bình luận
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserPhotos;
