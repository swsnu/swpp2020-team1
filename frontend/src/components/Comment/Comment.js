import React from 'react';
import "./Comment.css";
import { Card, CardContent, Typography, IconButton, Box } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

const Comment = props => {
  let {id, content, author, is_author, date, onEdit, onDelete} = props;
  return (
    <Card>
      <CardContent>
        <Typography>{content}</Typography>
        <Typography>{author}</Typography>
        <Typography>{date}</Typography>
        <Box display={is_author ? "" : "none"}>
          <IconButton onClick={() => onEdit(id, content)}><CreateIcon/></IconButton>
          <IconButton onClick={() => onDelete(id)}><DeleteIcon/></IconButton>
        </Box>
      </CardContent>

    </Card>
  )
}

export default Comment;