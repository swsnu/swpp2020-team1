import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import { Typography, Container } from '@material-ui/core';
import "./Item.css";

const Item = props => {
  const itemcounts = props.itemcounts.map(ic => {
    return (
      <div key={ic.id} className="item">
        <div className="expiration_date">{ic.expiration_date}</div>
        <div className="count">{ic.count}</div>  
        <IconButton className="btn_remove_item" onClick={() => props.onRemoveItem(ic.id, ic.count)}><RemoveIcon/></IconButton>
      </div>
    );
  })

  return (
    <Card className='Item'>
      <div className="item-title">{props.name}</div>
      {itemcounts}
    </Card>
  )
}

export default Item;