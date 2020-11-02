import React from 'react';

const Item = props => {
  return (
    <div className='Item'>
      <p className="item-title">Item Name: {props.item_name}</p>
    </div>
  )
}

export default Item;