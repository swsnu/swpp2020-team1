import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import ItemCard from '../../components/ItemConfirm/ItemCard';
import EditItem from '../../components/AddItem/EditItem';
import Result from '../../components/AddItem/Result';
import './ItemConfirm.css';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FoodifyLogo from '../../icons/Foodify.png';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7DBF1A',
      dark: '#7DBF1A',
      light: '#7DBF1A',
      contrastText: "#fff"
    },
  },
});

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  logo: {
    margin: 27,
  }
});

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];

  defaultItem = {
    name: '',
    container: (this.props.location.state ? this.props.location.state.container : 'fridge'),
    category_id: 0,
    category_name: '기타',
    barcode_num: '',
    expiration_date: Date.now(),
    count: 1
  }

  state = {
    currentItem: this.defaultItem,
    editingItemIdx: -1,
    editingItem: null
  }

  componentDidMount() {
    //document.getElementsByClassName("Result")[0].style.top = "-25px";
  }

  onClickEditItemButton = (id) => {
    this.setState({ 
      editingItemIdx: id, 
      editingItem: this.props.resultList[id] 
    });
  }

  onClickFinishAddItemButton = () => {
    this.props.onAddNewItem(this.state.currentItem);
    this.setState({
      currentItem: this.defaultItem
    });
  }

  onChangeAddItemValue = (value) => {
    this.setState({
      currentItem: {
        ...this.state.currentItem,
        ...value
      }
    })
  }

  onChangeEditItemValue = (value) => {
    this.setState({
      editingItem: {
        ...this.state.editingItem,
        ...value
      }
    })
  }

  onClickFinishEditItemButton = () => {
    this.props.onUpdateItemList(this.state.editingItemIdx, this.state.editingItem);
    this.setState({ 
      editingItemIdx: -1,
      editingItem: null 
    });  
  }

  onClickConfirmButton = async () => {
    for (let item of this.props.resultList) {
      let finalItem = item;
      if (finalItem.category_id === 0) {
        finalItem.category_name = "기타";
        finalItem.category_id = 200; // category_id of '기타'
      }
      if (finalItem.expiration_date === null) {
        finalItem.expiration_date = '2099/12/31';
      } else {
        finalItem.expiration_date = moment(finalItem.expiration_date).format('YYYY/MM/DD');
      }
      await this.props.onAddItem(finalItem);
    }

    this.props.resetItemList();
    this.props.history.push('/');
  }

  onClickMoveToAddItemButton = () => {
    this.props.history.push('/item/add', {container: this.defaultItem.container});
  }

  onClickTitleLogo = () => {
    this.props.history.push('/')
  }



  render() {
    const {classes} = this.props;
    const newItems = this.props.resultList.map((item, idx) => {
      // temporary category name
      if(idx == this.state.editingItemIdx) {
        return <EditItem id={idx} key={idx}
                  item={this.state.editingItem} 
                  onChangeEditItem={this.onChangeEditItemValue} 
                  onClickFinishEditItem={this.onClickFinishEditItemButton} />
      } else {
        return <ItemCard key={idx} id={idx} item={item} onClickEdit={this.onClickEditItemButton} />;
      }
    }).reverse();

    return (
      <MuiThemeProvider theme={theme}>
      <div className="ItemConfirm">
        <Container component="main" maxWidth="md" className="confirm_container">
          <Grid container justify="center">
                <Grid item>
                  <img className={classes.logo} src={FoodifyLogo} onClick={this.onClickTitleLogo}></img>  
                </Grid>
          </Grid>
          <Result isAddItem={false} 
                  item={this.state.currentItem} 
                  onClickFinishEditItem={this.onClickFinishAddItemButton} 
                  onChangeEditItem={this.onChangeAddItemValue} />
          <div className="HeaderName"></div>
          <div className="Main">
            {newItems}  
          </div>
          <div className="Footer">
          <Button
            id="onClickMoveToAddItemButton"
            variant="contained"
            color="primary"
            className={`"ConfirmButton" ${classes.button}`}
            startIcon={<PhotoCamera />}
            onClick={this.onClickMoveToAddItemButton}
          >
            추가 스캔
          </Button>
          <Button
            id="onClickMoveToConfirmButton"
            variant="contained"
            color="primary"
            className={`"ConfirmButton" ${classes.button}`}
            startIcon={<ShoppingCartIcon />}
            onClick={this.onClickConfirmButton}
          >
            담기 완료
          </Button>
          </div>
        </Container>
      </div>
      </MuiThemeProvider>
     );
  }
}

const mapStateToProps = state => {
  return {
    resultList: state.additem.resultList
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: (item) => dispatch(actionCreators.addItem(item)),
    onUpdateItemList: (id, item) => dispatch(actionCreators.updateItemList(id, item)),
    onAddNewItem: (item) => dispatch(actionCreators.addNewItem(item)),
    resetItemList: () => dispatch(actionCreators.resetItemList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ItemConfirm));