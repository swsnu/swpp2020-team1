import React from 'react';
import "./Comment.css";
import { Typography, IconButton, Box, Divider, Grid } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

const styles = {
  root: {
  },
  divider: {
    margin: 10,
  },
  comment: {
    marginTop:10,
    marginBotton:10,
    marginLeft:20,
    marginRight:20,
  },
  author: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "fontWeightMedium",
    fontFamily: ["Noto Sans KR", "sans-serif"]
  },
  content: {
    margin: 3,
    fontSize: 16,
    whiteSpace: 'pre-line', // recognize new line character
    fontFamily: ["Noto Sans KR", "sans-serif"]
  },

  date: {
    marginTop:9,
    marginRight:5,
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
    <Box className={classes.root}>
      <Divider className={classes.divider} />
      <Box className={classes.comment}>
        <Box className={classes.author} align="left" fontWeight="fontWeightBold">@{author}</Box>
          <Typography className={classes.content} align="left">{content}</Typography>
          <Grid className={classes.bottomLine} container justify="flex-start">
            <Grid item>
              <Typography className={classes.date} align="left">{moment(date).format("LLL")}</Typography>
            </Grid>
            {is_author ?
            <Grid item className={classes.iconContainer} align="left" >
              <IconButton className={`${classes.editIcon} editButton`} onClick={() => onEdit(id, content)}><CreateIcon/></IconButton>
              <IconButton className={`${classes.deleteIcon} deleteButton`} onClick={() => onDelete(id)}><DeleteIcon/></IconButton>
            </Grid>        
            : null 
            }
          </Grid>
      </Box>

    </Box>
  )
}

export default withStyles(styles)(Comment);