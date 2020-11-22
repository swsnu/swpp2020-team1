import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Item from '../../components/Item/Item';
import * as actionCreators from '../../store/actions/index';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Typography, Container, Button, Icon } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import './ItemContainer.css';

class ItemContainer extends Component{
  onClickAddItemButton = () => {
    this.props.history.push('/item/add', {container: this.props.type});
  }

  onRemoveItem = (id, count) => {
    this.props.onEditItemCount(id, count-1);
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

  render() {
    let items = null;
    if (this.props.items) {
      items = this.props.items.map(i => {
        return (
          <div key={i.id} id="ItemGridTile" className="ItemGridTile">
            <Item
              name={i.name}
              container={i.container}
              itemcounts={i.itemcounts}
              unit="temp-unit"
              className="Item"
              onRemoveItem={(ic_id, count) => this.onRemoveItem(ic_id, count)}
            />
          </div>

        );
      })
    }

    return (
        <div className="ItemContainer">
          <Container>
            <div className="ContainerHeader">
              <div className="ContainerName">{this.props.type.toUpperCase()}</div>
              <div className="AddItemButton"><div><AddIcon style={{color: "#ffffff"}}/></div><div className="AddItemLine" onClick={() => this.onClickAddItemButton()}>Add</div></div>
            </div>
            <div className={this.props.type === "fridge" ? "ItemGrid ItemGridFridge" : "ItemGrid"}>
              {items}
              {(this.props.items.length < 1 ? <div className="NoItem">NO INGREDIENTS HERE! PLEASE ADD YOURS :)</div> : null)}
            </div>
          </Container>
        </div>

    );
  }
}

const mapStateToProps = state => {
  return {

  };
}

const mapDispatchToProps = dispatch => {
  return {
    onEditItemCount: (id, count) => dispatch(actionCreators.editItemCount(id, count)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemContainer));