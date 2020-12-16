import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Container, ListItem, Button } from '@material-ui/core';
import CalendarImg from '../../icons/calendar.png'
import ShoppingCartImg from '../../icons/shopping-cart.png'
import RecipeImg from '../../icons/zap.png'

const NotiCard = props => {
  const { id, notiType, itemName, expirationDate, isRead, category, elapsedDays } = props.noti
  const expirationDateType = new Date(expirationDate)
  let notiContent = null
  if (notiType === 'expire') {
    let elapsedDaysString = null
    if (elapsedDays >= 2) elapsedDaysString = `오늘`
    else if (elapsedDays === 1) elapsedDaysString = '오늘'
    else if (elapsedDays === 0) elapsedDaysString = '오늘'
    else elapsedDaysString = '방금'
    notiContent =
      <div style={{flexDirecion: 'row', justifyContent: 'center'}}>
        <ListItem button className='NotiListItem' width='100%' onClick={() => {props.onRead(id, notiType, category)}}
            style={{backgroundColor: isRead ? '#ffffff' :  'rgba(125, 191, 26, 0.6)', justifyContent: 'space-between'}}>
          <div style={{width: 50}}>
            <img src={CalendarImg} width={20} height={20} />
          </div>
          <div style={{flex: 1}}>
            <Typography style={{fontSize: 14}}>
              {`[${itemName}]의 유통기한이 ${expirationDateType.getMonth() + 1}월 ${expirationDateType.getDate()}일에
                  만료됩니다. 얼른 드세요!`}
            </Typography>
            <Typography style={{fontSize: 12, fontWeight: 'bold', color: '#818181'}}>
              {`레시피를 확인해보세요.`}
            </Typography>
            <Typography style={{fontSize: 12, color: '#818181'}}>
              {elapsedDaysString}
            </Typography>
          </div>
        </ListItem>
      </div>
  } else if (notiType === 'buy_item') {
    // CHECK
    let temp = itemName.substring(0,itemName.length-1);
    let purchaseLink = `https://www.coupang.com/np/search?component=&q=${temp}&channel=user`

    let elapsedDaysString = null
    if (elapsedDays >= 2) elapsedDaysString = `오늘`
    else if (elapsedDays === 1) elapsedDaysString = '오늘'
    else if (elapsedDays === 0) elapsedDaysString = '오늘'
    else elapsedDaysString = '방금'

    notiContent =
      <div>
        <ListItem button className='NotiListItem' width='100%' onClick={() => {props.onRead(id, notiType, category)}} 
            style={{backgroundColor: isRead ? '#ffffff' : 'rgba(125, 191, 26, 0.6)', justifyContent: 'space-between'}}>
          <div style={{width: 50}}>
            <img src={ShoppingCartImg} width={20} height={20} />
          </div>
          <div style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <div>
            <Typography style={{fontSize: 14}}>
              {`[${itemName}](이)가 얼마 남지 않았네요.`}
            </Typography>
            <Typography style={{fontSize: 12, fontWeight: 'bold', color: '#818181'}}>
              {`버튼을 클릭하여 최저가를 확인해보세요!`}
            </Typography>
            <Typography style={{fontSize: 12, color: '#818181'}}>
              {elapsedDaysString}
            </Typography>
            </div>
          </div>
        <div className='purchaseLink' onClick={() => {window.open(purchaseLink);}}
            style={{height: 20, width: 90, textAlign: 'center', backgroundColor: '#7DBF1A', borderRadius: 10}}>
          <Typography style={{fontSize: 13, color: '#ffffff', alignSelf: 'center'}}>
            {"구매하러 가기"}
          </Typography>
        </div>
        </ListItem>
      </div>
  } else if (notiType === 'recipe') {
    notiContent =
      <div style={{flexDirecion: 'row', justifyContent: 'center'}}>
        <ListItem button className='NotiListItem' width='100%' onClick={() => {props.onRead(id, notiType, category)}} 
            style={{backgroundColor: '#ffffff', justifyContent: 'space-between'}}>
          <div style={{width: 50}}>
            <img src={RecipeImg} width={20} height={20} />
          </div>
          <div style={{flex: 1}}>
            <Typography style={{fontSize: 14}}>
              {`[${itemName}](을)를 활용한 레시피를 확인해보세요!`}
            </Typography>
            <Typography style={{fontSize: 12, fontWeight: 'bold', color: '#818181'}}>
              {`다양한 레시피가 준비되어 있습니다.`}
            </Typography>
            <Typography style={{fontSize: 12, color: '#818181'}}>
              {"오늘"}
            </Typography>
          </div>
        </ListItem>
      </div>
  } else {
    console.log(`Noti type ${notiType} is not supported.`)
  }
  return (
    notiContent
  )
}

export default NotiCard;