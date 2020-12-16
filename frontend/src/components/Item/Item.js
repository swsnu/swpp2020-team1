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
    color: "#343434",
  },
  expireUrgent: {
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
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontSize: 16,
    height: 44,
    marginBottom: 4,
    width: 124,
  },
  countButton:{
    marginLeft: 5,
    marginRight: 5,
  },
});

const isExpireUrgent = (dateString) => {
  let expireTimestamp = Date.parse(dateString)
  let currentTimestamp = new Date();
  let elapsedDays = Math.floor((expireTimestamp - currentTimestamp) / (24 * 60 * 60 * 1000))
  return elapsedDays < 3
}

const Item = props => {
  let itemCountSum = 0;
  props.itemcounts.forEach(elem => {itemCountSum += elem.count})
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
    <Card style={props.mode === "Selected" ? {backgroundColor: "#7DBF1A"} : {backgroundColor: "#FFFFFF"}} className={`${classes.root} ${props.mode === "normal" ? 'Item' : 'Item Select'}`} onClick={props.mode === "normal" ? () => onClickCard(props.itemcounts) : () => onClickSelectCard(props.id)}>
      <div className='ItemContents'>
        <div className={`item-title ${classes.title}`}>{props.name}</div>
        <div key={itemFastestExpDate.id} className="item">
          <div className={`${isExpireUrgent(itemFastestExpDate.expiration_date) ? classes.expireUrgent : classes.expire} expiration_date`}>
            {itemFastestExpDate.expiration_date === '2099/12/31' ? null : itemFastestExpDate.expiration_date }
          </div>
          <div className={`count ${classes.countBlock}`}>
            {itemCountSum}
          </div>
        </div>
      </div>
      {tmpDialog}
    </Card>
  )
}

export default Item;