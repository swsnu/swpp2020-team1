import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import axios from 'axios';
import './RecipeRecommend.css';
import { List, ListItem } from '@material-ui/core';

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

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    console.log("searchResults: " + JSON.stringify(this.props.searchResults))
    let results = this.props.searchResults.map(recipe => {
      const videoUrl = recipe.video_url
      const videoKey = videoUrl.substring(videoUrl.lastIndexOf('=') + 1)
      const score = recipe.rating_average
      return (
        <ListItem button key={recipe.id} onClick={() => this.goToRecipeDetail(recipe.id)}>
          <img src={`http://i.ytimg.com/vi/${videoKey}/mqdefault.jpg`} width={160} height={90} />
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
    onSearchRecipes: (ingredients, preference) => dispatch(actionCreators.searchRecipes(ingredients, preference)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeRecommend);