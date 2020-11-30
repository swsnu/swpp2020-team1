import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainPage from './containers/MainPage/MainPage';
import AddItem from './containers/AddItem/AddItem';
import ItemConfirm from './containers/ItemConfirm/ItemConfirm';
import RecipeRecommend from './containers/RecipeRecommend/RecipeRecommend';
import RecipeDetail from './containers/RecipeDetail/RecipeDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path = '/' exact component={MainPage}/>
          <Route path = '/item/add' exact component = {AddItem}/>
          <Route path = '/item/confirm' exact component={ItemConfirm}/>
          <Route path = '/recipes' exact component={RecipeRecommend}/>
          <Route path = '/recipes/:id' exact component={RecipeDetail}/>
          {/* <Route render={() => <h1>Not Found</h1>} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
