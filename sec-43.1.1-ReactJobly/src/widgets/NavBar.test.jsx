import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import NavBar from './NavBar';

describe('NavBar Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
