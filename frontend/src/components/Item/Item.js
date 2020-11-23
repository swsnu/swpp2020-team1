import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import { Dialog, Typography, Container } from '@material-ui/core';
import "./Item.css";

const Item = props => {
  const itemFastestExpDate = props.itemcounts.sort((a, b) => {
    if(new Date(a.expiration_date) > new Date(b.expiration_date)) {
      return 1;
    } else  {
      return -1;
    }
  })[0];

  
  const onClickSelectCard = (id) => {
    console.log(id);
    props.onClickSelectItem(id);
    //props.name;
  }

  let tmpDialog = null;

  const onClickCard = (itemcounts) => {
    console.log(itemcounts);
    props.onClickCard(itemcounts);
  }

  return (
    <Card style={props.mode === "Selected" ? {backgroundColor: "rgba(232, 160, 101)"} : null} className={props.mode === "normal" ? 'Item' : 'Item Select'} onClick={props.mode === "normal" ? () => onClickCard(props.itemcounts) : () => onClickSelectCard(props.id)}>
      <div className='ItemContents'>
        <div className="item-title">{props.name}</div>
        <div key={itemFastestExpDate.id} className="item">
          <div className="expiration_date">{itemFastestExpDate.expiration_date}</div>
          <div className="count">{itemFastestExpDate.count}</div>
          <IconButton className="btn_remove_item" onClick={(event) => props.onRemoveItem(event, itemFastestExpDate.id, itemFastestExpDate.count)}><RemoveIcon/></IconButton>
        </div>
      </div>
      {tmpDialog}
    </Card>
  )
}

export default Item;