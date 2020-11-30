import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import './RecipeDetail.css';

class RecipeDetail extends Component {


  componentDidMount() {

  }


  render() {


    return (
        <div className="RecipeDetail">
          RecipeDetail!
        </div>

        
    );
  }
}

const mapStateToProps = state => {
  return {
    ratedRecipes: state.recipe.rated_recipes
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipe: (recipe_id) => dispatch(actionCreators.getRecipe(recipe_id)),
    getRatedRecipes: () => dispatch(actionCreators.getRatedRecipes()),
    giveRating: (recipe_id, rating) => dispatch(actionCreators.putRecipe(recipe_id, rating)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);