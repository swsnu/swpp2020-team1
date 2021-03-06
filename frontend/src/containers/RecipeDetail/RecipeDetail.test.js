import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import RecipeDetail from './RecipeDetail';
import Comment from '../../components/Comment/Comment';
import { getMockStore } from '../../mock';
import * as commentActionCreators from '../../store/actions/comment';
import * as actionTypes from '../../store/actions/actionTypes'; 

jest.mock('../../components/Comment/Comment', () => jest.fn())

const stubInitialState = {
  recipe: {
    recipes: [],
    selectedRecipe: {
      id:1, 
      title: "r1", 
      description: "d1", 
      video_url: "u1",  
      cuisine_type: "korean", 
      ingredients:[1,2],
      rating_average: 3.0
    },
    ratedRecipes: [],
    searchResults: [],
  },
  comment: {
    comments: [
      {id:1, content:"c1", author_id:1, author:"user1", recipe_id:1, date: "2020-11-20"},
      {id:2, content:"c2", author_id:2, author:"user2", recipe_id:1, date: "2020-11-20"},
    ],
  },
  
  category: {
    categories: [
      {id: 1, name: 'c1'},
      {id: 2, name: 'c2'},
    ]
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<RecipeDetail />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let recipeDetail, mockHistory, mockMatch;
  beforeEach(() => {
    Comment.mockImplementation(props => {
      return (
        <div className="Comment">
            <div className="content">{props.content}</div>
            <button className="editCommentButton" onClick={() => props.onEdit(props.id, props.content)}></button>
            <button className="deleteCommentButton" onClick={() => props.onDelete(props.id)}></button>
        </div>
      );
    })

    mockHistory = {push: jest.fn(), goBack: jest.fn()};
    mockMatch = {params: {id: 1}};
    recipeDetail = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <RecipeDetail history={mockHistory} match={mockMatch}/>} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })


  it('should render recipeDetail', async () => {
    const component = mount(recipeDetail).find('RecipeDetail'); // .find('RecipeDetail') needed because of withStyles()
    const wrapper = component.find('.RecipeDetail');
    expect(wrapper.length).toBeGreaterThan(0);
  });

  it('should handle back button', async () => {
    const component = mount(recipeDetail).find('RecipeDetail');
    const backButton = component.find('.backButton button');
    backButton.simulate('click');
    expect(mockHistory.goBack).toHaveBeenCalled();
  });

  it('should handle rating', async () => {
    const component = mount(recipeDetail).find('RecipeDetail');
    const instance = component.instance();
    const ratingButton = component.find('.ratingButton button');
    ratingButton.simulate('click');
    expect(component.state().ratingDialogOpen).toBe(true);
    
    // Can't open dialog...
    // component.update()
    // const confirmRatingButton = component.find('.confirmRatingButton button');
    // confirmRatingButton.simulate('click');
    // expect(component.state().ratingWarning).toBe(true);
    // component.setState({newRating: 3.0})
    // confirmRatingButton.simulate('click');
    // expect(component.state().ratingDialogOpen).toBe(false);

    // ratingButton.simulate('click')
    // const closeRatingButton = component.find('.closeRatingButton button');
    // closeRatingButton.simulate('click');
    // expect(component.state().ratingDialogOpen).toBe(false);


    // just call function directly
    // close dialog
    instance.onCloseRatingDialog();
    expect(instance.state.ratingDialogOpen).toBe(false);

    instance.onClickRatingButton();
    // confirm rating with null
    instance.setState({newRating: null})
    instance.onConfirmRating();
    expect(instance.state.ratingWarning).toBe(true);
    // confirm rating with right value
    instance.setState({newRating: 5});
    instance.onConfirmRating();
    expect(instance.state.ratingWarning).toBe(false);
  })

  it('should handle create comment', () => {
    let spyCreateComment = jest.spyOn(commentActionCreators, 'createComment')
      .mockImplementation(() => { return {type: actionTypes.CREATE_COMMENT} });
    const component = mount(recipeDetail).find('RecipeDetail');
    const createCommentButton = component.find('.createCommentButton button');
    createCommentButton.simulate('click');
    expect(spyCreateComment).toHaveBeenCalled()
  })

  it('should handle edit comment', () => {
    
    const component = mount(recipeDetail).find('RecipeDetail');
    const editCommentButton = component.find('.editCommentButton').at(0);
    editCommentButton.simulate('click');
    expect(component.state().editCommentDialogOpen).toBe(true)

    // Can't open dialog...
    // component.update()
    // const confirmEditButton = component.find('.confirmEditButton button');
    // confirmEditButton.simulate('click');
    // expect(component.state().editCommentDialogOpen).toBe(false);

    // editCommentButton.simulate('click');
    // const closeEditButton = component.find('.closeEditButton button');
    // closeEditButton.simulate('click');
    // expect(component.state().editCommentDialogOpen).toBe(false);


    const instance = component.instance();
    // cancel edit
    instance.onCloseEditCommentDialog();
    expect(instance.state.editCommentDialogOpen).toBe(false);

    instance.onClickEditButton();
    expect(instance.state.editCommentDialogOpen).toBe(true);
    // confirm edit
    instance.onConfirmEdit();
    expect(instance.state.editCommentDialogOpen).toBe(false);


  })

  it('should handle delete comment', () => {
    
    const component = mount(recipeDetail).find('RecipeDetail');
    const deleteCommentButton = component.find('.deleteCommentButton').at(0);
    deleteCommentButton.simulate('click');
    const instance = component.instance();

    instance.onClickDeleteButton();


  })

  it('should handle titlelogo comment', () => {
    
    const component = mount(recipeDetail).find('RecipeDetail');
    const titleLogo = component.find('.titlelogo')
    titleLogo.simulate('click');
    expect(mockHistory.push).toHaveBeenCalledTimes(1);
  })

  it('should', () => {
    const component = mount(recipeDetail).find('RecipeDetail');
    const instance = component.instance();
    instance.onConfirmRating()

  })



});

