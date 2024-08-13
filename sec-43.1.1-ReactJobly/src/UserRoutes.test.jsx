import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserRoutes from './UserRoutes';

describe('UserRoutes Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserRoutes />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserRoutes />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
  