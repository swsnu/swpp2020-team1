import React from 'react';

const Item = props => {
  console.log(props.itemcounts);
  const itemcounts = props.itemcounts.map(ic => {
    return (
      <div>
        <div className="expiration_date">Expiration date: {ic.expiration_date}</div>
        <div className="count">Count: {ic.count}</div>  
        <button onClick={() => props.onRemoveItem(ic.id, ic.count-1)}>-</button>
      </div>
    );
  })
  return (
    <div className='Item'>
      <div className="item-title">Item Name: {props.name}</div>
      {itemcounts}
    </div>
  )
}

export default Item;