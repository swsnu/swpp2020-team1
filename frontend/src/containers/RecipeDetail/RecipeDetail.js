import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actionCreators from '../../store/actions/index';
import Comment from '../../components/Comment/Comment';
import './RecipeDetail.css';
import { TextField, Button, IconButton, Typography, Box, Grid, Toolbar, AppBar, Collapse, Container, Divider } from '@material-ui/core';
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
import FoodifyLogo from '../../icons/Foodify.png';

const styles = {
  font: {
    fontFamily: ["Noto Sans KR", "sans-serif"]
  },
  root: {
    backgroundColor: '#f4f4f4',
  },

  RecipeDetail: {
    backgroundColor: '#ffffff',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 5,
    paddingBottom: 10,
  },

  headerContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitleGreen: {
    fontWeight: 900,
    fontSize: 30,
    color: '#7DBF1A',
  },
  headerTitleBlack: {
    fontWeight: 900,
    fontSize: 30,
    color: '#000000',
  },
  backButton: {
    paddingTop: 0,
    paddingBottom: 6,
  },

  recipeTitle: {
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },

  ingredientContainer: {
    margin: 10
  },
  ingredientText : {
    backgroundColor: '#F0F0F0',
    color: '#333333',
    margin: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
  },

  ratingContainer: {
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  rating: {
    marginTop:5,
  },
  ratingText: {
    paddingLeft: 4,
    paddingRight: 2,
    marginTop:5,
    fontSize: 15,
    fontWeight: 600,
  },
  ratingButton: {
    marginRight: 20,
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 13,
    fontWeight: 500,
    background: "#7DBF1A",
    color: "#ffffff",
    '&:hover': {
      backgroundColor: '#6BAD07',
    },
    '&:disabled': {
      color: '#343434',
    },
    boxShadow: '0.1rem 0.1rem 0.1rem 0 rgba(201,201,201,.9)',
  },
  newRatingText: {
    marginLeft: 10,
  },

  descriptionContainer: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center'
  },
  descriptionIcon: {
    marginRight:15,
    fontSize: 25,
  },
  descriptionLabel: {
    fontSize: 20,
    fontWeight: 600,
    paddingBottom: 5,
  },
  descriptionText: {
    whiteSpace: 'pre-line', // recognize new line character
  },
  expandIcon: {
  },
  expandDescription: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 0,
  },

  commentHeaderContainer: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center'
  },
  commentIcon: {
    marginRight:15,
    fontSize: 25,
  },
  commentLabel: {
    fontSize: 20,
    fontWeight: 600,
    paddingBottom: 10,
  },
  newComment: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    width: "80%"
  },
  createButton: {
    marginTop: 20,
  },

  commentsContainer: {
    marginBottom: 20,
  },
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

    expandDescription: true,
  }

  async componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
    this.props.getRatedRecipes();
    this.props.getComments(this.props.match.params.id);
    this.props.getCategories();
    await axios.get('/back/user/')
      .then(res => this.user_id = res.data.user_id)
      .catch(e => {})
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

  onClickTitleLogo = () => {
    this.props.history.push('/')
  }

  render() {
    const {classes} = this.props;

    let comments = this.props.comments
      .map(comment => {return {...comment, date: new Date(comment.date)}})
      .sort((c1, c2) => c2.date - c1.date) // sort by date
      .map(comment => {
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
    

    let ingredients = this.props.categories ? this.props.selectedRecipe.ingredients.map(category_id => {
      const ing = this.props.categories.find(c => c.id === category_id);
      const name = ing ? ing.name : null;
      return (
        <Grid item key={category_id}>
          <Box className={`${classes.font} ${classes.ingredientText}`} borderRadius="20%">
            {/* <Typography align="left" className={`${classes.font} ${classes.ingredientText}`}>{name}</Typography> */}
            {name}
          </Box>
        </Grid>
      );
    }) : null;

    return this.props.selectedRecipe ? (
      <Grid className={classes.root} container justify="center">
        <Container className={classes.RecipeDetailContainer} maxWidth="md">
        <Box className={`${classes.RecipeDetail} RecipeDetail`} boxShadow={3}>
          {/* Header */}
          <Grid className={classes.headerContainer} container>
            <Grid item container xs={2} justify="flex-start" alignItems="center">
              <Grid item>
                <IconButton className={`${classes.backButton} backButton`} onClick={this.onClickBackButton}><ArrowBackIcon/></IconButton>
              </Grid>
            </Grid>
            <Grid item container xs={8} justify="center">
              <Grid item>
                <img className="titlelogo" src={FoodifyLogo} onClick={this.onClickTitleLogo}></img>  
              </Grid>
            </Grid>
            
            <Grid item xs={2}>
              {/* dummy to divide space into three */}
            </Grid>
          </Grid>

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
          <Typography variant="h5" align="left" className={`${classes.recipeTitle} ${classes.font}`}>{this.props.selectedRecipe.title}</Typography>

          {/* Ingredients */}
          <Grid className={classes.ingredientContainer} container>
            {ingredients}
          </Grid>

          {/* Rating */}
          <Grid container justify="space-between" className={classes.ratingContainer}>
            <Grid item container xs={8} alignItems="center">
              <Grid item>
              <Rating className={classes.rating}
                      value={this.props.selectedRecipe.rating_average}
                      precision={0.1}
                      readOnly
                      name="ratingAverage"
                      />
              </Grid>
              <Grid item>
              <Typography className={`${classes.font} ${classes.ratingText}`} display="inline">
                  {this.props.selectedRecipe.rating_average
                    ? this.props.selectedRecipe.rating_average.toFixed(1)+" / 5" 
                    : "별점이 없어요!"}
              </Typography>
              </Grid>
            </Grid>

            <Grid item container xs={4} justify="flex-end" className={classes.ratingButtonContainer}>
              <Grid item>
              <Button className={`${classes.ratingButton} ratingButton`} onClick={this.onClickRatingButton} disabled={alreadyRated}>
                  {alreadyRated ? "평가 완료" : "별점 주기"}
              </Button>
              </Grid>
            </Grid>
          </Grid>


          {/* Rating Dialog */}
          <Dialog 
            open={this.state.ratingDialogOpen} 
            onClose={this.onCloseRatingDialog}
            fullWidth
            maxWidth="sm">
          <DialogTitle id="form-dialog-title">별점 주기</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item>
                <Rating
                value={this.state.newRating}
                precision={0.5}
                onChange={(event, value) => this.setState({newRating: value})}
                onChangeActive={(event, hoverValue) => this.setState({hoverRating: hoverValue})}
                name="newRating"/>
              </Grid>
              <Grid item>
                <Typography className={`${classes.font} ${classes.newRatingText}`}>
                  {this.state.hoverRating === -1 ? this.state.newRating : this.state.hoverRating}
                </Typography>
              </Grid>
            </Grid>
            <Box display={this.state.ratingWarning ? "" : "none"}><Typography color="error">별점을 입력해주세요!</Typography></Box>
          </DialogContent>
          <DialogActions>
            <Button className="closeRatingButton" onClick={this.onCloseRatingDialog} color="primary">취소</Button>
            <Button className="confirmRatingButton" onClick={this.onConfirmRating} color="primary">확인</Button>
          </DialogActions>
          </Dialog>          

          <Divider />

          {/* Description */}
          <Grid className={classes.descriptionContainer} container onClick={()=>this.setState({expandDescription: !this.state.expandDescription})}>
            <Grid item>
              <DescriptionIcon className={classes.descriptionIcon}/>
            </Grid>
            <Grid item>
              <Box className={`${classes.descriptionLabel} ${classes.font}`} fontWeight={900}>Description</Box>
            </Grid>
            <Grid item>
              <IconButton className={classes.expandIcon} ><ExpandMoreIcon/></IconButton>
            </Grid>
          </Grid>
          <Collapse className={classes.expandDescription} in={this.state.expandDescription}>
                <Typography align="left" className={`${classes.descriptionText} ${classes.font}`}>{this.props.selectedRecipe.description}</Typography>
          </Collapse>

          <Divider />

          {/* Comment Header */}
          <Grid className={classes.commentHeaderContainer}container>
            <Grid item>
              <ChatBubbleOutlineIcon className={classes.commentIcon}/>
            </Grid>
            <Grid item>
              <Box className={`${classes.commentLabel} ${classes.font}`} fontWeight={900}>Comment</Box>
            </Grid>
          </Grid>
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
            fullWidth
          />
          <IconButton className={`${classes.createButton} createCommentButton`} onClick={this.onClickCreateButton}><CreateIcon/></IconButton>

          {/* Comments */}
          <Box className={classes.commentsContainer}>
            <div>{comments}</div>
          </Box>
          
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
              rows={5}
              variant="outlined"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button className="closeEditButton" onClick={this.onCloseEditCommentDialog} color="primary">취소</Button>
            <Button className="confirmEditButton" onClick={this.onConfirmEdit} color="primary">확인</Button>
          </DialogActions>
        </Dialog>

        </Box>
        </Container>
      </Grid>


        
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    selectedRecipe: state.recipe.selectedRecipe,
    ratedRecipes: state.recipe.ratedRecipes,
    comments: state.comment.comments,
    categories: state.category.categories,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipe: (recipe_id) => dispatch(actionCreators.getRecipe(recipe_id)),
    getCategories: () => dispatch(actionCreators.getCategories()),
    getRatedRecipes: () => dispatch(actionCreators.getRatedRecipes()),
    giveRating: (recipe_id, rating) => dispatch(actionCreators.putRecipe(recipe_id, rating)),
    getComments: (recipe_id) => dispatch(actionCreators.getComments(recipe_id)),
    createComment: (recipe_id, comment) => dispatch(actionCreators.createComment(recipe_id, comment)),
    editComment: (comment) => dispatch(actionCreators.editComment(comment)),
    deleteComment: (comment_id) => dispatch(actionCreators.deleteComment(comment_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecipeDetail));
