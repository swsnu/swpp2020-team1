import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import RecipeRecommend from './RecipeRecommend';
import { getMockStore } from '../../mock';
import * as itemActionCreators from '../../store/actions/item';
import * as itemcountActionCreators from '../../store/actions/itemcount';


const stubInitialState = {
  item: {
    items: [],
  },
  itemcount: {
    itemcounts: [],
  },
  article: {
    articles: [],
    selectedArticle: []
  },
  notification: {
    notifications: []
  },
  recipe: {
    recipes: [],
    searchResults: [
      {
        "id": 113,
        "title": "우리집이 휴게소 '소떡어떡'",
        "description": "description1",
        "video_url": "https://www.youtube.com/watch?v=OSYQHa-vbVU",
        "cuisine_type": "korean",
        "ingredients": [
            1,
            15,
            46,
            58,
            60,
            61,
            102,
            103
        ],
        "rating_average": -1,
        "num_ingredients": 1
      },
      {
        "id": 113,
        "title": "우리집이 휴게소 '소떡어떡'",
        "description": "description2",
        "video_url": "https://www.youtube.com/watch?v=OSYQHa-vbVU",
        "cuisine_type": "korean",
        "ingredients": [
            1,
            15,
            46,
            58,
            60,
            61,
            102,
            103
        ],
        "rating_average": 2.3,
        "num_ingredients": 1
      }
    ],
  },
};

const mockStore = getMockStore(stubInitialState);

describe('<RecipeRecommend />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let recipeRecommend, mockHistory;
  beforeEach(() => {

    mockHistory = {push: jest.fn(), goBack: jest.fn()}

    recipeRecommend = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <RecipeRecommend history={mockHistory} />} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })


  it('should render RecipeRecommend', async () => {
    const component = mount(recipeRecommend);
    const wrapper = component.find('.RecipeRecommend');
    expect(wrapper.length).toBe(1);
  });

  it('should handle goBack button', () => {
    const component = mount(recipeRecommend);
    const wrapper = component.find('.btn_back');
    wrapper.simulate('click');
    expect(mockHistory.goBack).toHaveBeenCalledTimes(1);
  })

  it('should handle goToRecipe', () => {
    const component = mount(recipeRecommend);
    const wrapper = component.find('.recipe_detail').at(0);
    wrapper.simulate('click');
    expect(mockHistory.push).toHaveBeenCalledTimes(1);
  })

  it('should call removeEventListener', () => {
    const component = mount(recipeRecommend);
    component.unmount();
    //expect(mockHistory.push).toHaveBeenCalledTimes(1);
  })

  it('should handle empty search result', () => {
    const newInitialState = { ...stubInitialState, recipe: {
      recipes: [],
      searchResults: [
        {
          "id": 113,
          "title": "우리집이 휴게소 '소떡어떡'",
          "description": "description1",
          "video_url": "https://www.youtube.com/watch?v=OSYQHa-vbVU",
          "cuisine_type": "korean",
          "ingredients": [
              1,
              15,
              46,
              58,
              60,
              61,
              102,
              103
          ],
          "rating_average": -1,
          "num_ingredients": 0
        }]
      }
    }
    const newMockStore = getMockStore(newInitialState);
    recipeRecommend = (
      <Provider store={newMockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <RecipeRecommend history={mockHistory} />} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
    const component = mount(recipeRecommend);
  })
});
