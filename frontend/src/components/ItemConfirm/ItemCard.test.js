import ItemCard from './ItemCard';
import { mount } from 'enzyme';
import moment from 'moment';
describe('<ItemCard />', () => {
  it('should render correctly', () => {
    const stubExpDate = new Date('2020/11/24');
    const stubItem = {
      name: '냉장 서울우유 1L',
      barcode_num: '8801115114154',
      expiration_date: stubExpDate,
      category_name: '우유',
      category_id: 7,
      count: 4, 
      container: 'freezer'
    }

    let component = mount(<ItemCard item={stubItem} />);
    expect(component.find('.tableContentItemCard1').at(0).text()).toEqual(stubItem.name);
    expect(component.find('.tableContentItemCard1').at(1).text()).toEqual(stubItem.barcode_num);
    expect(component.find('.tableContentItemCard2').at(0).text()).toEqual(moment(stubItem.expiration_date).format('YYYY/MM/DD'));
    expect(component.find('.tableContentItemCard2').at(1).text()).toEqual(stubItem.category_name);
    expect(component.find('.CountEditItem').text()).toEqual(JSON.stringify(stubItem.count));
    expect(component.find('.CategoryEditItem').text()).toEqual(stubItem.container);
  })

  it('should render correctly when expDate is null', () => {
    const stubItem = {
      name: '냉장 서울우유 1L',
      barcode_num: '8801115114154',
      expiration_date: null,
      category_name: '우유',
      category_id: 7,
      count: 4, 
      container: 'freezer'
    }

    let component = mount(<ItemCard item={stubItem} />);
    expect(component.find('.tableContentItemCard2').at(0).text()).toEqual('');
  })

  it('should work well on onClickEdit', () => {
    const stubItem = {
      name: '냉장 서울우유 1L',
      barcode_num: '8801115114154',
      expiration_date: null,
      category_name: '우유',
      category_id: 7,
      count: 4, 
      container: 'freezer'
    }

    const mockOnClickEdit = jest.fn(value => value);

    let component = mount(<ItemCard item={stubItem} onClickEdit={mockOnClickEdit} id={0} />);
    component.find('button').simulate('click')
    expect(mockOnClickEdit).toHaveBeenCalledTimes(1)
    expect(mockOnClickEdit.mock.calls[0][0]).toEqual(0)

  })
})