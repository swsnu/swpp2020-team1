import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Item from '../../components/Item/Item';
import * as actionCreators from '../../store/actions/index';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Dialog, Typography, Container, Button, Icon } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/Remove';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import './ItemContainer.css';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontWeight: 500,
    fontSize: 14,
  },
  expire: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.error.main,
    marginBottom: 5,
  },
  count:{
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  countButton:{
    marginLeft: 5,
    marginRight: 5,
  },
  countBlock:{
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pos: {
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 12,
  },
  xButton:{
    marginTop: 12,
    marginBottom: 12, 
  }
});

class ItemContainer extends Component {
  state = {
    seen: false,
    itemcounts: []
  }
  onClickAddItemButton = () => {
    this.props.history.push('/item/add', {container: this.props.type});
  }

  onRemoveItem = (e, id, count) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    if(this.state.seen) {
      let tmpItemCounts = this.state.itemcounts;
      tmpItemCounts = tmpItemCounts.map(i => {
        if(i.id === id) return { ...i, count: i.count - 1 };
        return i;
      })
      tmpItemCounts = tmpItemCounts.filter(i => i.count != 0)
      this.setState({ itemcounts: tmpItemCounts })
    }

    this.props.onEditItemCount(id, count-1)
    .then(() => {
      this.props.buildNotification();
    })
  }

  onAddItem = (e, id, count) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    if(this.state.seen) {
      let tmpItemCounts = this.state.itemcounts;
      tmpItemCounts = tmpItemCounts.map(i => {
        if(i.id === id) return { ...i, count: i.count + 1 };
        return i;
      })
      tmpItemCounts = tmpItemCounts.filter(i => i.count != 0)
      this.setState({ itemcounts: tmpItemCounts })
    }

    this.props.onEditItemCount(id, count+1)
    .then(() => {
      this.props.buildNotification();
    })
  }



  componentDidMount() {
    //let itemGridTiles = document.getElementsByClassName("ItemGridTile")
    //for(let i = 0; i < itemGridTiles.length; i++) {
    //  itemGridTiles[i].style.width = (this.props.currentWidth / 3) + "px";
    //  itemGridTiles[i].style.height = (this.props.currentHeight * 0.15) + "px";
    //}
  }

  componentDidUpdate() {
    //let itemGrid = document.getElementsByClassName("ItemGridTile")
    //for(let i = 0; i < itemGrid.length; i++) {
    //  itemGrid[i].style.width = (this.props.currentWidth / 3) + "px";
    //  itemGrid[i].style.height = (this.props.currentHeight * 0.15) + "px";
    //}
  }

  onClickCard = (itemcounts) => {
    this.setState({seen: true, itemcounts});
  } 

  onClickCardOff = () => {
    this.setState({seen: false, itemcounts: []});
  }

  render() {
    const { classes } = this.props;
    let items = null;
    if (this.props.items) {
      items = this.props.items.map(i => {
        return (
          <div key={i.id} id="ItemGridTile" className="ItemGridTile">
            <Item
              id={i.id}
              name={i.name}
              container={i.container}
              itemcounts={i.itemcounts}
              unit="temp-unit"
              className="Item"
              onClickCard={(itemcounts) => this.onClickCard(itemcounts)}
              onClickSelectItem={(id) => this.props.onClickSelectItem(id)}
              onAddItem={(e, ic_id, count) => this.onAddItem(e, ic_id, count)} 
              onRemoveItem={(e, ic_id, count) => this.onRemoveItem(e, ic_id, count)}
              mode={(this.props.selectedItemIds.filter(id => id === i.id).length > 0 ? "Selected" : this.props.mode)}
            />
          </div>

        );
      })
    }

    const itemcounts = (this.state.itemcounts.length > 0 ? this.state.itemcounts.map(ic => {
      return (
        <Card key={ic.id} className={`${classes.root} itemListShape`}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Expiration Date
          </Typography>
          <Typography className={`"expiration_date" ${classes.expire}`} variant="h5" component="h2">
          {ic.expiration_date === '2099/12/31' ? null : ic.expiration_date}
          </Typography>
          <Typography className={`"count" ${classes.pos}`} color="textSecondary">
          <div className={classes.countBlock}><IconButton className={`"btn_remove_item" ${classes.countButton}`} onClick={(event) => this.onRemoveItem(event, ic.id, ic.count)}><RemoveCircleIcon/></IconButton>{ic.count}<IconButton className={`"btn_remove_item" ${classes.countButton}`} onClick={(event) => this.onAddItem(event, ic.id, ic.count)}><AddCircleIcon/></IconButton></div>
          </Typography>
          <Typography className={classes.count}variant="body2" component="p">
            {/* <div className={classes.countBlock}>{ic.count}<IconButton className="btn_remove_item" onClick={(event) => this.onRemoveItem(event, ic.id, ic.count)}><RemoveIcon/></IconButton></div> */}
          </Typography>
        </CardContent>
      </Card>


      );
    }) : null);

    return (
        <div className="ItemContainer">
          <Container>
            <div className="ContainerHeader">
              <div className="ContainerName">{this.props.type.toUpperCase()}</div>
              <div className="AddItemButton"><div><AddIcon style={{color: "#ffffff"}}/></div>
              <div className="AddItemLine" onClick={() => this.onClickAddItemButton()}>Add</div></div>
            </div>
            <div className={this.props.type === "fridge" ? "ItemGrid ItemGridFridge" : "ItemGrid"}>
              {items}
              {(this.props.items.length < 1 ? <div><div id="ItemDummy"></div><div className="NoItem">등록된 재료가 없습니다. ADD 버튼을 클릭해 재료를 추가해주세요</div><div id="ItemDummy"></div></div> : null)}
            </div>
          </Container>

          <Dialog open={this.state.seen} maxWidth="sm" onBackdropClick={()=>this.setState({seen: false})}>
            <Button className={classes.xButton} onClick={this.onClickCardOff}>X</Button>
            <div overflowY="auto">{itemcounts}</div>
          </Dialog>
        </div>

        
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notification.notifications,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onEditItemCount: (id, count) => dispatch(actionCreators.editItemCount(id, count)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ItemContainer)));