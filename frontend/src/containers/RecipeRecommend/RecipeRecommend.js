import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './RecipeRecommend.css';
import { List, ListItem, IconButton } from '@material-ui/core';

class RecipeRecommend extends Component {

  recipeSample = [
  ]

  state = {
    currentHeight: 1280,
    currentWidth: 720,
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize = () => {
    let currentHeight = window.innerHeight;
    let currentWidth = window.innerWidth;
    this.setState({currentHeight, currentWidth});
  }

  goToRecipeDetail = (id) => {
    this.props.history.push(`/recipes/${id}`)
  }

  onClickBackButton = () => {
    this.props.history.goBack()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    let results = this.props.searchResults.map(recipe => {
      const videoUrl = recipe.video_url
      const videoKey = videoUrl.substring(videoUrl.lastIndexOf('=') + 1)
      const score = recipe.rating_average
      return (
        <ListItem className="recipe_detail" button key={recipe.id} onClick={() => this.goToRecipeDetail(recipe.id)}>
          <div className="thumbnail_wrapper">
            <img className="thumbnail" src={`http://i.ytimg.com/vi/${videoKey}/mqdefault.jpg`}/>
          </div>
          <div className='RecipeInfo'>
            <div className='RecipeTitle'>{recipe.title}</div>
            <div className='RecipeScore'>
              {`${score === -1 ? '0.0' : (Math.round(score * 100) / 100).toFixed(1)}/5.0`}
            </div>
          </div>
        </ListItem>
      )
    })
    return (
        <div className="RecipeRecommend">
          <div className="title">
            <div className="btn_back" onClick={this.onClickBackButton}>
              <IconButton className="btn_arrow"><ArrowBackIcon/></IconButton>
            </div>
            <div className="titleOrange">Food</div>
            <div className="titleBlack">ify</div>
          </div>
          { this.props && this.props.searchResults[0] && this.props.searchResults[0].num_ingredients === 0 ?
            <div className='NoSearchResults'>검색 결과가 부족하여 인기순으로 표시됩니다.</div> : null }
          <div>
            <List style={{backgroundColor: '#f4f4f4'}}>
              { results }
            </List>
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchResults: state.recipe.searchResults,
  };
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeRecommend);