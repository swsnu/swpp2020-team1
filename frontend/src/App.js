import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainPage from './containers/MainPage/MainPage';
import AddItem from './components/AddItem/AddItem';
import ItemConfirm from './components/ItemConfirm/ItemConfirm';

function App() {
  return (
  <BrowserRouter>
    <div className="App">
      <Switch>
      <Route path = '/' exact render={()=><MainPage title={'MAIN PAGE'}/>}/>
      <Route path = '/item/add' exact component = {AddItem}/>
      <Route path = '/item/confirm' exact component={ItemConfirm}/>
      <Route render={() => <h1>Not Found</h1>} />
      </Switch>
    </div>
  </BrowserRouter>
  );
}

export default App;
