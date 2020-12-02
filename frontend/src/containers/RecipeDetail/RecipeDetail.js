import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actionCreators from '../../store/actions/index';
import Comment from '../../components/Comment/Comment';
import './RecipeDetail.css';
import { TextField, Button, IconButton, Typography, Box } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CreateIcon from '@material-ui/icons/Create';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';


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
  }

  async componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
    this.props.getRatedRecipes();
    this.props.getComments(this.props.match.params.id);
    await axios.get('/back/user/')
      .then(res => this.user_id = res.data.user_id)
      .catch(e => console.log(e))
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
          <div className="header">
            <IconButton className="backButton" onClick={this.onClickBackButton}><ArrowBackIcon/></IconButton>
            <Typography>Recipe</Typography>
          </div>
          <iframe 
            width="560" 
            height="315" 
            src={this.props.selectedRecipe.video_url.replace("watch?v=", "embed/")} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
          <div>{this.props.selectedRecipe.title}</div>

          {/* Rating */}
          <div>
            <Rating
              value={this.props.selectedRecipe.rating_average}
              precision={0.1}
              readOnly
              name="ratingAverage"/>
            <Typography>{this.props.selectedRecipe.rating_average.toFixed(2) || "아직 별점이 없어요!"}</Typography>
          </div>
          <Button onClick={this.onClickRatingButton} disabled={alreadyRated}>{alreadyRated ? "평가 완료" : "별점 주기"}</Button>
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

          <div>{this.props.selectedRecipe.description}</div>

          {/* Create new comment */}
          <TextField
            className="newComment"
            value={this.state.newCommentContent}
            onChange={(e)=>this.setState({newCommentContent: e.target.value})}
            label="새 댓글"
            placeholder="내용을 입력하세요"
            multiline
            rows={4}
            variant="outlined"
          />
          <IconButton className="createButton" onClick={this.onClickCreateButton}><CreateIcon/></IconButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);