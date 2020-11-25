import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import axios from 'axios';
import './RecipeRecommend.css';

class RecipeRecommend extends Component {

  recipeSample = [
  ]

  state = {
    currentHeight: 1280,
    currentWidth: 720,
    recipes: [],
  }

  componentDidMount() { 

    this.props.onGetRecipes();
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize = () => {
    let currentHeight = window.innerHeight;
    let currentWidth = window.innerWidth;
    this.setState({currentHeight, currentWidth});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    
    return (
        <div className="RecipeRecommend">
          <div className="title">
            <div className="titleOrange">Food</div>
            <div className="titleBlack">ify</div>
          </div>
          <div>
            {JSON.stringify(this.props.recipes)}
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    recipes: state.recipe.recipes,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // jaeseok: performance issue?
    onGetRecipes: () => dispatch(actionCreators.getRecipes()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeRecommend);