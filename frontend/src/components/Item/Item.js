import React from 'react';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/Remove';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "./Item.css";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // minWidth: 275,
  },
  expire: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 14,
    fontWeight: 500,
    color: "#E86565",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginTop: 12,
    color: "#818181",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontWeight: 900,
    fontSize: 14,
  },
  countBlock:{
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 14,
    marginBottom: 3,
  },
  countButton:{
    marginLeft: 5,
    marginRight: 5,
  },
});

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
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card style={props.mode === "Selected" ? {backgroundColor: "rgba(232, 160, 101)"} : null} className={`${classes.root} ${props.mode === "normal" ? 'Item' : 'Item Select'}`} onClick={props.mode === "normal" ? () => onClickCard(props.itemcounts) : () => onClickSelectCard(props.id)}>
      <div className='ItemContents'>
        <div className={`"item-title" ${classes.title}`}>{props.name}</div>
        <div key={itemFastestExpDate.id} className="item">
          <div className={`${classes.expire} "expiration_date"`}>
            {itemFastestExpDate.expiration_date === '2099/12/31' ? null : itemFastestExpDate.expiration_date }
          </div>
          <div className={`"count" ${classes.countBlock}`}>
            <IconButton className={`btn_remove_item ${classes.countButton}`} onClick={(event) => props.onRemoveItem(event, itemFastestExpDate.id, itemFastestExpDate.count)}><RemoveCircleIcon/></IconButton>
            {itemFastestExpDate.count}
            <IconButton className={`btn_remove_item ${classes.countButton}`} onClick={(event) => props.onAddItem(event, itemFastestExpDate.id, itemFastestExpDate.count)}><AddCircleIcon/></IconButton>
          </div>
        </div>
      </div>
      {tmpDialog}
    </Card>
  )
}

export default Item;