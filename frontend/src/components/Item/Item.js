import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import { Typography, Container } from '@material-ui/core';

const Item = props => {
  console.log(props.itemcounts);
  const itemcounts = props.itemcounts.map(ic => {
    return (
      <Container key={ic.id}>
        <div className="expiration_date">Expiration date: {ic.expiration_date}</div>
        <div className="count">Count: {ic.count}</div>  
        <IconButton onClick={() => props.onRemoveItem(ic.id, ic.count)}><RemoveIcon/></IconButton>
      </Container>
    );
  })
  console.log(props.name)

  return (
    <Card className='Item'>
      <Typography variant="h6" className="item-title">{props.name}</Typography>
      <CardContent>{itemcounts}</CardContent>
    </Card>
  )
}

export default Item;