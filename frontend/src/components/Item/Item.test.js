import { mount } from 'enzyme';
import Item from './Item';
import Card from '@material-ui/core/Card';

const stubItemCounts = [
  {expiration_date: "2020/11/27", id: 1, count: 1},
  {expiration_date: "2020/12/30", id: 2, count: 2},
  {expiration_date: "2020/12/15", id: 3, count: 3}
]

const mockOnClickSelectItem = jest.fn(value => value);
const mockOnClickCard = jest.fn();
const mockOnRemoveItem = jest.fn();
const mockOnAddItem = jest.fn();

const props = {
  itemcounts: stubItemCounts,
  onClickSelectItem: mockOnClickSelectItem,
  onClickCard: mockOnClickCard,
  onRemoveItem: mockOnRemoveItem, 
  onAddItem: mockOnAddItem,
  id: 20
}

describe('<Item />', () => {

  it('should render correctly', () => {
    let component = mount(<Item mode="Selected" {...props}/>)
    let wrapper = component.find(".ItemContents");
    expect(wrapper.find(".count")).toEqual({});

    let wrapper2 = component.find(Card);
    wrapper2.simulate('click');
    expect(mockOnClickSelectItem.mock.calls[0][0]).toEqual(props.id)
  })

  it('should render correctly on high expiration date', () => {
    const stubItemCountsXX = [
      {expiration_date: "2099/12/31", id: 1, count: 1}
    ]

    const props = {
      itemcounts: stubItemCountsXX,
      onClickSelectItem: mockOnClickSelectItem,
      onClickCard: mockOnClickCard,
      onRemoveItem: mockOnRemoveItem, 
      onAddItem: mockOnAddItem,
      id: 20
    }

    let component = mount(<Item mode="normal" {...props} />);
    expect(component.find(".expiration_date").text()).toEqual("");
  })

  it('should handle onClickCard function correctly', () => {
    let component = mount(<Item mode="normal" {...props}/>)

    let wrapper2 = component.find(Card);
    wrapper2.simulate('click');
    expect(mockOnClickCard.mock.calls[0][0]).toEqual(props.itemcounts)
  })
})