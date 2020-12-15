import EditItem from './EditItem';
import Result from './Result';
import { mount } from 'enzyme';

jest.mock('./EditItem', () => jest.fn())

describe('<Result />', () => {
  it('should render correctly', () => {
    EditItem.mockImplementation(props => {
      return (
        <div className="EditItem"></div>
      );
    })

    let component = mount(<Result />);
    let wrapper = component.find(".Result");
    expect(wrapper.length).toBe(1);
  })
})