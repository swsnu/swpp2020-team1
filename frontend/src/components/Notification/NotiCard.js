import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Container, ListItem, Button } from '@material-ui/core';
import CalendarImg from '../../icons/calendar.png'

const NotiCard = props => {
  const { id, notiType, itemName, expirationDate, isRead } = props.noti
  const expirationDateType = new Date(expirationDate)
  let creationTimestamp = expirationDateType.getTime() - 3 * 24 * 60 * 60 * 1000
  const currentTimestamp = new Date()
  const elapsedDays = Math.floor((currentTimestamp - creationTimestamp) / (24 * 60 * 60 * 1000))
  const noti = props.noti
  let notiContent = null
  if (notiType === 'expire') {
    notiContent =
      <ListItem className='NotiListItem' style={{backgroundColor: isRead ? '#ffffff' : 'rgba(232, 160, 101, 0.6)',
          justifyContent: 'space-between', width: window.innerWidth }}>
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
            {elapsedDays > 0 ? `${elapsedDays}일 전` : `방금`}
          </Typography>
        </div>
      </ListItem>
  } else {
    console.log(`Noti type ${notiType} is not supported.`)
  }
  return (
    <Button className='NotiCardBtn' style={{padding: 0}} onClick={() => props.onRead(id)}>
      { notiContent }
    </Button>
  )
}

export default NotiCard;