import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Container } from '@material-ui/core';

const NotiCard = props => {
  console.log("props: " + JSON.stringify(props))
  const noti = props.noti
  let notiContent = null
  if (noti.notiType === 'expiration_date') {
    notiContent = 
      <Container>
        <div>{`"${noti.itemName}"의 유통기한이 ${noti.expirationDate} 까지입니다. 얼른 드세요!`}</div>
      </Container>
  } else {
    console.log(`Noti type ${noti.notiType} is not supported.`)
  }

  return (
    <Card className='Item'>
      <Typography variant="h6" className="item-title">{"유통기한 알림"}</Typography>
      <CardContent>{notiContent}</CardContent>
    </Card>
  )
}

export default NotiCard;