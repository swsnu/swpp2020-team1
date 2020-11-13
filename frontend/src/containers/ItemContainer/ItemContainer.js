import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Item from '../../components/Item/Item';
import * as actionCreators from '../../store/actions/index';
import Grid from '@material-ui/core/Grid';
import { Typography, Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';

class ItemContainer extends Component{
  onClickAddItemButton = () => {
    this.props.history.push('/item/add', {container: this.props.type});
  }

  onRemoveItem = (id, count) => {
    this.props.onEditItemCount(id, count-1);
  }

  render() {
    let items = null;
    if (this.props.items) {
      items = this.props.items.map(i => {
        return (
          <Grid key={i.id} item>
            <Item
              name={i.name}
              container={i.container}
              itemcounts={i.itemcounts}
              unit="temp-unit"
              onRemoveItem={(ic_id, count) => this.onRemoveItem(ic_id, count)}
            />
          </Grid>

        );
      })
    }

    return (
      <Container>
        <Typography variant="h4" className="ContainerName">{this.props.type.toUpperCase()}</Typography>
        <Grid container spacing={3} direction="row" className="ItemContainer">
          {items}
          <IconButton className="btn_add_item" onClick={()=>this.onClickAddItemButton()}><AddBoxIcon /></IconButton>
        </Grid>
      </Container>
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