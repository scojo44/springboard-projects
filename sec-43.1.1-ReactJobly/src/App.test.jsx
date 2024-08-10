import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import App from './App';

describe('App Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
