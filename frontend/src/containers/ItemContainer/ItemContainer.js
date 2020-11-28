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
import RemoveIcon from '@material-ui/icons/Remove';
import './ItemContainer.css';

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

  componentDidMount() {
    let itemGridTiles = document.getElementsByClassName("ItemGridTile")
    for(let i = 0; i < itemGridTiles.length; i++) {
      itemGridTiles[i].style.width = (this.props.currentWidth / 3) + "px";
      itemGridTiles[i].style.height = (this.props.currentHeight * 0.15) + "px";
    }
  }

  componentDidUpdate() {
    let itemGrid = document.getElementsByClassName("ItemGridTile")
    for(let i = 0; i < itemGrid.length; i++) {
      itemGrid[i].style.width = (this.props.currentWidth / 3) + "px";
      itemGrid[i].style.height = (this.props.currentHeight * 0.15) + "px";
    }
  }

  onClickCard = (itemcounts) => {
    this.setState({seen: true, itemcounts});
  } 

  onClickCardOff = () => {
    this.setState({seen: false, itemcounts: []});
  }

  render() {
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
              onRemoveItem={(e, ic_id, count) => this.onRemoveItem(e, ic_id, count)}
              mode={(this.props.selectedItemIds.filter(id => id === i.id).length > 0 ? "Selected" : this.props.mode)}
            />
          </div>

        );
      })
    }

    const itemcounts = (this.state.itemcounts.length > 0 ? this.state.itemcounts.map(ic => {
      return (
        <div key={ic.id} className="itemListShape">
          <div className="expiration_date">{ic.expiration_date}</div>
          <div className="count">{ic.count}</div>
          <IconButton className="btn_remove_item" onClick={(event) => this.onRemoveItem(event, ic.id, ic.count)}><RemoveIcon/></IconButton>
        </div>
      );
    }) : null);

    return (
        <div className="ItemContainer">
          <Container>
            <div className="ContainerHeader">
              <div className="ContainerName">{this.props.type.toUpperCase()}</div>
              <div className="AddItemButton"><div><AddIcon style={{color: "#ffffff"}}/></div><div className="AddItemLine" onClick={() => this.onClickAddItemButton()}>Add</div></div>
            </div>
            <div className={this.props.type === "fridge" ? "ItemGrid ItemGridFridge" : "ItemGrid"}>
              {items}
              {(this.props.items.length < 1 ? <div className="NoItem">NO INGREDIENTS HERE! PLEASE ADD YOURS</div> : null)}
            </div>
          </Container>

          <Dialog open={this.state.seen}>
            <Button onClick={this.onClickCardOff}>X</Button>
            {itemcounts}
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
    onGetUserNotiList: (user_id) => dispatch(actionCreators.getUserNotiList(user_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemContainer));