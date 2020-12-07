import React from 'react';
import "./Comment.css";
import { Card, CardContent, Typography, IconButton, Box } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

const styles = {
  cardContent: {
    padding: 15,
    "&:last-child": {
      paddingBottom: 15
    }
  },
  author: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "fontWeightMedium",
  },
  content: {
    margin: 3,
    fontSize: 16,
    whiteSpace: 'pre-line' // recognize new line character
  },
  date: {
    fontSize:14,
    color: '#B8B8B8'
  },
  iconContainer: {
    margin : 0,
  },
  editIcon: {
    padding: 5
  },
  deleteIcon: {
    padding: 5
  }
}

const Comment = props => {
  let {classes, id, content, author, is_author, date, onEdit, onDelete} = props;
  return (
    <Card className="Comment" variant="outlined">
      <CardContent className={classes.cardContent}>
        <Box className={classes.author} align="left" fontWeight="fontWeightBold">@{author}</Box>
        <Typography className={classes.content} align="left">{content}</Typography>
        <Typography className={classes.date} align="left">{moment(date).format("LLL")}</Typography>
        {is_author ?
          <Box className={classes.iconContainer} align="left" >
          <IconButton className={`${classes.editIcon} editButton`} onClick={() => onEdit(id, content)}><CreateIcon/></IconButton>
          <IconButton className={`${classes.deleteIcon} deleteButton`} onClick={() => onDelete(id)}><DeleteIcon/></IconButton>
          </Box>        
        : null 
        }
      </CardContent>

    </Card>
  )
}

export default withStyles(styles)(Comment);