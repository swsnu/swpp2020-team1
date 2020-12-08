import '../AddItem/EditItem.css';
import moment from 'moment';

const ItemCard = (props) => {
  return (
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
          <td className="tableContentName">항목</td>
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
        
        <button onClick={() => props.onClickEdit(props.id)} >수정</button>
      </div>
    </div>
  )
};

export default ((ItemCard));