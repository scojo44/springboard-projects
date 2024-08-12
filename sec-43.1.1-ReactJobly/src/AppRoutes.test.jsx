import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import AppRoutes from './AppRoutes';

describe('AppRoutes Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
