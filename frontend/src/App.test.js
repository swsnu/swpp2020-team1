import { render } from '@testing-library/react';
import App from './App';
import { mount } from "enzyme"

test('render', () => {
  mount(<App />);
});
