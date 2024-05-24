import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
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
import {
  CommentText,
  CommentMetadata,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentActions,
  CommentAction,
  CommentAuthor,
  FormTextArea,
  Comment,
  Form,
  Header,
} from "semantic-ui-react";
import { deepOrange } from "@mui/material/colors";
import { Image } from "primereact/image";
import SendIcon from "@mui/icons-material/Send";
const UserPhotos = () => {
  const { userId } = useParams();
  const loggedInUserId = localStorage.getItem("user_id");
  const [photos, setPhotos] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://nzgzhz-8081.csb.app/api/photo/photosOfUser/${userId}`,
        );
        setPhotos(response.data);
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Người dùng chưa up ảnh");
        } else {
          console.error("Error fetching photos:", error);
        }
      }
    };

    fetchPhotos();
  }, [userId]);

  const handleCommentChange = (photoId, event) => {
    setCommentTexts((prev) => ({
      ...prev,
      [photoId]: event.target.value,
    }));
  };

  const handleCommentSubmit = async (photoId) => {
    const commentText = commentTexts[photoId];
    if (!commentText) {
      setCommentErrors((prev) => ({
        ...prev,
        [photoId]: "Cần điền nội dung",
      }));
      return;
    }
    try {
      const userId = localStorage.getItem("user_id");
      const userName = localStorage.getItem("user_name");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://nzgzhz-8081.csb.app/api/photo/${photoId}/comments`,
        { comment: commentText, user_id: userId, user_name: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the photos state to reflect the new comment
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo._id === photoId ? response.data : photo,
        ),
      );

      setCommentTexts((prev) => ({
        ...prev,
        [photoId]: "", // Clear the comment input field for the specific photo
      }));
      setCommentErrors((prev) => ({
        ...prev,
        [photoId]: null, // Clear the comment error for the specific photo
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setUploadError("Vui lòng chọn một file ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://nzgzhz-8081.csb.app/api/photo/uploadPhoto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
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
      {userId === loggedInUserId && (
        <Box
          my={4}
          display="flex"
          alignItems="center"
          gap={4}
          p={2}
          sx={{ border: "2px solid grey" }}
        >
          <input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePhotoUpload}
            style={{ marginTop: "10px" }}
          >
            UPLOAD
          </Button>
          <>{uploadError && <Alert severity="error">{uploadError}</Alert>}</>
        </Box>
      )}
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        photos.map((photo) => (
          <Photo
            key={photo._id}
            photo={photo}
            onCommentSubmit={handleCommentSubmit}
            onCommentChange={handleCommentChange}
            commentText={commentTexts[photo._id] || ""}
            commentError={commentErrors[photo._id]}
            showAllComments={showAllComments}
            setShowAllComments={setShowAllComments}
          />
        ))
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
  commentError,
}) => {
  const { _id, date_time, file_name, comments } = photo;

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <Card variant="outlined" style={{ marginBottom: "20px" }}>
      <CardContent>
        <Image
          src={`https://nzgzhz-8081.csb.app/uploads/${file_name}`}
          alt="Image"
          width="250"
          preview
        />
        <Typography variant="caption" display="block" gutterBottom>
          Time : {new Date(date_time).toLocaleString()}
        </Typography>
        <Header as="h3" dividing>
          Comments
        </Header>
        {visibleComments && visibleComments.length > 0 ? (
          <List>
            {visibleComments.map((comment) => (
              <ListItem key={comment._id} alignItems="flex-start">
                <CommentContent>
                  <CommentAuthor as="a">
                    <Typography variant="h5" component="h2">
                      {comment.user_name || "Anonymous"}
                    </Typography>
                  </CommentAuthor>
                  <CommentMetadata>
                    <Typography variant="caption" display="block" gutterBottom>
                      Time : {new Date(comment.date_time).toLocaleString()}
                    </Typography>
                  </CommentMetadata>
                  <CommentText>{comment.comment}</CommentText>
                </CommentContent>
              </ListItem>
            ))}
          </List>
        ) : (
          <CommentText>Chưa có bình luận nào</CommentText>
        )}
        {!showAllComments && comments.length > 2 && (
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => setShowAllComments(true)}
          >
            Hiển thị thêm bình luận ({comments.length - 2})
          </MuiLink>
        )}
        <TextField
          label="Bình luận"
          variant="outlined"
          value={commentText}
          onChange={(event) => onCommentChange(_id, event)}
          fullWidth
          multiline
          rows={3}
          style={{ marginTop: "20px" }}
        />
        <Button>
          <SendIcon
            variant="contained"
            color="primary"
            onClick={() => onCommentSubmit(_id)}
          ></SendIcon>
        </Button>
        <>{commentError && <Alert severity="error">{commentError}</Alert>}</>
      </CardContent>
    </Card>
  );
};

export default UserPhotos;
