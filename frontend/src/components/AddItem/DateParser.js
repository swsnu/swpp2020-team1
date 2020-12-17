import moment from 'moment';

export default function parseDate(text) {
// DD-MM-YYYY
  const re1 = /(?<date>0[1-9]|[12][0-9]|3[01])[\/\-\.](?<month>0[1-9]|1[012])[\/\-\.](?<year>\d{4})/g;
/*  /.(?<date>0[1-9]|[12][0-9]|3[01]).[\/\-\.].(?<month>0[1-9]|1[012]).[\/\-\.].(?<year>\d{4})./g;   */
// YYYY-MM-DD
  const re2 = /(?<year>\d{4})[\/\-\.](?<month>0[1-9]|1[012])[\/\-\.](?<date>0[1-9]|[12][0-9]|3[01])/g;
/*  /.(?<year>\d{4}).[\/\-\.].(?<month>0[1-9]|1[012]).[\/\-\.].(?<date>0[1-9]|[12][0-9]|3[01])./g;   */
// MM-DD
  const re3 = /(?<month>0[1-9]|1[012])[\/\-\.](?<date>0[1-9]|[12][0-9]|3[01])/g;
/*  /.(?<month>0[1-9]|1[012]).[\/\-\.].(?<date>0[1-9]|[12][0-9]|3[01])./g;    */
  
  const matched1 = text.matchAll(re1);
  const matched2 = text.matchAll(re2);
  const matched3 = text.matchAll(re3);
  let expDates = [];

  let year, month, date;
  for(let match of matched1) {
    year = match.groups.year;
    month = match.groups.month;
    date = match.groups.date;
    expDates.push(moment(year + '/' + month + '/' + date))
  }
  for(let match of matched2) {
    year = match.groups.year;
    month = match.groups.month;
    date = match.groups.date;
    expDates.push(moment(year + '/' + month + '/' + date))
  }
  if(!(year && month && date)) {
    for(let match of matched3) {
      year = new Date().getFullYear();
      month = match.groups.month;
      date = match.groups.date;
      expDates.push(moment(year + '/' + month + '/' + date))
    }
  }

  const fastestExpDate = expDates.sort((a, b) => {
    if(a < b) {
      return 1;
    } else  {
      return -1;
    }
  })[0];

  return expDates.length === 0 ? 'error' : fastestExpDate.format('YYYY/MM/DD');
}