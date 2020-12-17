import '../AddItem/EditItem.css';
import moment from 'moment';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Card from '@material-ui/core/Card'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7DBF1A',
      dark: '#7DBF1A',
      light: '#7DBF1A',
      contrastText: "#fff"
    },
  },
});

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const styles = (theme) => ({
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','), 
    fontSize: 14,
  },
  button: {
    margin: theme.spacing(1),
  },
});

const ItemCard = (props) => {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={classes.root}>
    <div className="EditItem">
      <table className="tableItemCard"><tbody>
        <tr>
          <td className="tableContentName">이름</td>
          <td className="tableContentItemCard1">
            {props.item.name}
          </td>
        </tr>
        <tr>
          <td className="tableContentName">바코드</td>
          <td className="tableContentItemCard1">
            {props.item.barcode_num}
          </td>
        </tr>
        <tr>
          <td className="tableContentName">유통기한</td>
          <td className="tableContentItemCard2">
            {props.item.expiration_date !== null ? moment(props.item.expiration_date).format('YYYY/MM/DD') : '' }
          </td>
        </tr>
        <tr>
          <td className="tableContentName">카테고리</td>
          <td className="tableContentItemCard2">
            {props.item.category_name}
          </td>
        </tr>
      </tbody></table>
      <div className="EditItemContentItemCard">
        <div style={{fontFamily: '"Noto Sans KR", sans-serif', fontSize: 13, color: "#949494"}}>수량</div>
        <div className="CountEditItem">
          {props.item.count}
        </div>
        <div className="CategoryEditItem">
          {props.item.container}
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<EditOutlinedIcon />}
          onClick={() => props.onClickEdit(props.id)}
          >
          EDIT
        </Button> 
      </div>
    </div>
    </Card>
    </MuiThemeProvider>
  )
};

export default ((ItemCard));