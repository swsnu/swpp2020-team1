import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import Comment from '../../components/Comment/Comment';
import './RecipeDetail.css';
import { TextField, Button, IconButton, Typography, Box, Grid, Toolbar, AppBar, Collapse } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import CreateIcon from '@material-ui/icons/Create';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  appbar: {
    background: "#F4F4F4",
    color: "#343434",
    position: "relative",
  },

  typography: {
    flexGrow: 1,
    align: "center"
  },

  recipeTitle: {
    margin: 20
  },

  ratingContainer: {
    margin: 20
  },
  rating: {
  },
  ratingText: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 20,
    fontSize: 18,
  },
  ratingButton: {
    marginTop: 2,
    fontWeight: 700,
    background: "#7DBF1A",
    color: "#343434",
    '&:hover': {
      backgroundColor: '#6BAD07',
    },
    '&:disabled': {
      color: '#343434',
    },
    boxShadow: '0.1rem 0.1rem 0.1rem 0 rgba(201,201,201,.9)',
  },

  descriptionIcon: {
    marginRight:15,
    fontSize: 30,
  },
  descriptionLabel: {
    fontSize: 18,
  },
  descriptionText: {
    whiteSpace: 'pre-line', // recognize new line character
    margin: 20,
  },
  expandIcon: {
    marginLeft: 'auto',
  },

  commentIcon: {
    marginRight:15,
    fontSize: 30,
  },
  commentLabel: {
    fontSize: 18,
  },
  newComment: {
    margin: 20,
    width: "80%",
  },
  createButton: {
    marginTop: 20,
  }
};


class RecipeDetail extends Component {
  // TEMPORARY
  user_id = 1

  state = {
    newCommentContent: '',
    editCommentId: 0,
    editCommentContent: '',
    editCommentDialogOpen: false,

    newRating: 5,
    hoverRating: -1,
    ratingWarning: false,
    ratingDialogOpen: false,

    expandDescription: false,
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
    this.props.getRatedRecipes();
    this.props.getComments(this.props.match.params.id);
  }

  onClickBackButton = () => {
    this.props.history.goBack()
  }

  onClickRatingButton = () => {
    this.setState({ratingDialogOpen: true})
  }

  onCloseRatingDialog = () => {
    this.setState({ratingDialogOpen: false, newRating: 5, ratingWarning: false})
  }

  onConfirmRating = () => {
    if (this.state.newRating === null) {
      this.setState({ratingWarning: true})
      return;
    }
    this.props.giveRating(this.props.match.params.id, this.state.newRating)
    this.setState({ratingDialogOpen: false, newRating: 5, ratingWarning: false})
  }

  onClickCreateButton = () => {
    const newComment = {content: this.state.newCommentContent};
    this.props.createComment(this.props.match.params.id, newComment);
    this.setState({newCommentContent: ''});
  }

  onClickEditButton = (comment_id, content) => {
    this.setState({editCommentDialogOpen: true, editCommentId: comment_id, editCommentContent: content})
  }

  onConfirmEdit = () => {
    this.props.editComment({id: this.state.editCommentId, content: this.state.editCommentContent})
    this.setState({editCommentDialogOpen: false, editCommentId: 0, editCommentContent: ''})
  }

  onCloseEditCommentDialog = () => {
    this.setState({editCommentDialogOpen: false})
  }

  onClickDeleteButton = (comment_id) => {
    this.props.deleteComment(comment_id)
  }

  render() {
    const {classes} = this.props;

    let comments = this.props.comments.map(comment => {
      return (
        <Comment 
          key={comment.id} 
          id={comment.id}
          content={comment.content} 
          author={comment.author}
          is_author={this.user_id === comment.author_id} 
          date={comment.date}
          onEdit={this.onClickEditButton}
          onDelete={this.onClickDeleteButton}/>
      );
    });

    let alreadyRated = this.props.ratedRecipes && this.props.ratedRecipes.includes(parseInt(this.props.match.params.id));

    return this.props.selectedRecipe ? (
        <div className="RecipeDetail">
          {/* Header */}
          <AppBar className={classes.appbar}>
            <Toolbar>
                <IconButton className="backButton" onClick={this.onClickBackButton}><ArrowBackIcon/></IconButton>
                <Typography className={classes.typography} variant="h5">Recipe</Typography>
                <Button>Logout</Button>
            </Toolbar>
          </AppBar>

          {/* Video */}
          <div className="videoContainer">
            <iframe 
              className={`${classes.video} video`}
              src={this.props.selectedRecipe.video_url.replace("watch?v=", "embed/")} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>

          {/* Title */}
          <Typography variant="h5" align="left" className={classes.recipeTitle}>{this.props.selectedRecipe.title}</Typography>

          {/* Rating */}
          <AppBar className={classes.appbar}>
            <Toolbar>
              <Rating className={classes.rating}
                value={this.props.selectedRecipe.rating_average}
                precision={0.1}
                readOnly
                name="ratingAverage"/>
              <Box className={classes.ratingText} fontWeight={700}>
                {this.props.selectedRecipe.rating_average ? this.props.selectedRecipe.rating_average.toFixed(2)+" / 5.0" : "아직 별점이 없어요!"}
              </Box>
              <Button className={classes.ratingButton} onClick={this.onClickRatingButton} disabled={alreadyRated}>
                {alreadyRated ? "평가 완료" : "별점 주기"}
              </Button>
            </Toolbar>
          </AppBar>

          {/* Rating Dialog */}
          <Dialog 
            open={this.state.ratingDialogOpen} 
            onClose={this.onCloseRatingDialog}
            fullWidth
            maxWidth="sm">
          <DialogTitle id="form-dialog-title">별점 주기</DialogTitle>
          <DialogContent>
            <Rating
              value={this.state.newRating}
              precision={0.5}
              onChange={(event, value) => this.setState({newRating: value})}
              onChangeActive={(event, hoverValue) => this.setState({hoverRating: hoverValue})}
              name="newRating"/>
            {this.state.hoverRating === -1 ? this.state.newRating : this.state.hoverRating}
            <Box display={this.state.ratingWarning ? "" : "none"}><Typography color="error">별점을 입력해주세요!</Typography></Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCloseRatingDialog} color="primary">취소</Button>
            <Button onClick={this.onConfirmRating} color="primary">확인</Button>
          </DialogActions>
          </Dialog>          

          {/* Description */}
          <AppBar className={classes.appbar} onClick={()=>this.setState({expandDescription: !this.state.expandDescription})}>
            <Toolbar>
              <DescriptionIcon className={classes.descriptionIcon}/>
              <Box className={classes.descriptionLabel} fontWeight={900}>Description</Box>
              <IconButton className={classes.expandIcon} ><ExpandMoreIcon/></IconButton>
            </Toolbar>
          </AppBar>
          {/* Collapse */}
          <Collapse in={this.state.expandDescription}>
            <Typography align="left" className={classes.descriptionText}>{this.props.selectedRecipe.description}</Typography>
          </Collapse>


          {/* Comment Header */}
          <AppBar className={classes.appbar}>
            <Toolbar>
              <ChatBubbleOutlineIcon className={classes.commentIcon}/>
              <Box className={classes.commentLabel} fontWeight={900}>Comment</Box>
            </Toolbar>
          </AppBar>
          {/* Create new comment */}
          <TextField
            className={`${classes.newComment} newComment`}
            value={this.state.newCommentContent}
            onChange={(e)=>this.setState({newCommentContent: e.target.value})}
            label="새 댓글"
            placeholder="내용을 입력하세요"
            multiline
            rows={3}
            variant="outlined"
          />
          <IconButton className={`${classes.createButton} newComment`} onClick={this.onClickCreateButton}><CreateIcon/></IconButton>
          {/* Comments */}
          <div>{comments}</div>
          
          {/* Edit Dialog */}
          <Dialog 
            open={this.state.editCommentDialogOpen} 
            onClose={this.onCloseEditCommentDialog}
            fullWidth
            maxWidth="sm">
          <DialogTitle id="form-dialog-title">댓글 수정하기</DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.editCommentContent}
              onChange={(e) => this.setState({editCommentContent: e.target.value})}
              margin="dense"
              className="editComment"
              placeholder="내용을 입력하세요"
              multiline
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCloseEditCommentDialog} color="primary">취소</Button>
            <Button onClick={this.onConfirmEdit} color="primary">확인</Button>
          </DialogActions>
        </Dialog>

        </div>

        
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    selectedRecipe: state.recipe.selectedRecipe,
    ratedRecipes: state.recipe.ratedRecipes,
    comments: state.comment.comments,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipe: (recipe_id) => dispatch(actionCreators.getRecipe(recipe_id)),
    getRatedRecipes: () => dispatch(actionCreators.getRatedRecipes()),
    giveRating: (recipe_id, rating) => dispatch(actionCreators.putRecipe(recipe_id, rating)),
    getComments: (recipe_id) => dispatch(actionCreators.getComments(recipe_id)),
    createComment: (recipe_id, comment) => dispatch(actionCreators.createComment(recipe_id, comment)),
    editComment: (comment) => dispatch(actionCreators.editComment(comment)),
    deleteComment: (comment_id) => dispatch(actionCreators.deleteComment(comment_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecipeDetail));