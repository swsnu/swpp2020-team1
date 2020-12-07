import React from 'react';
import { shallow, mount } from 'enzyme';
import Comment from './Comment';

describe('<Comment />', () => {
  it('should reder without errors', () => {
    const component = mount(<Comment />);
    const wrapper = component.find('.Comment');
    expect(wrapper).toBeDefined();
  });

  it('should hide edit & delete button when not author', () => {
    let mockOnEdit = jest.fn();
    let mockOnDelete = jest.fn();
    const component = mount(<Comment is_author={false} onEdit={mockOnEdit} onDelete={mockOnDelete}/>);
    let editButton = component.find('.editButton button');
    expect(() => editButton.simulate('click')).toThrow()
  })

  it('should handle edit & delete button', () => {
    let mockOnEdit = jest.fn();
    let mockOnDelete = jest.fn();
    const component = mount(<Comment is_author={true} onEdit={mockOnEdit} onDelete={mockOnDelete}/>);
    component.find('.editButton button').simulate('click');
    expect(mockOnEdit).toHaveBeenCalled();
    component.find('.deleteButton button').simulate('click');
    expect(mockOnDelete).toHaveBeenCalled();
  })



});
