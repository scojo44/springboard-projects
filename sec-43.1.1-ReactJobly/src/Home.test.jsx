import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import Home from './Home';

describe('Home Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
