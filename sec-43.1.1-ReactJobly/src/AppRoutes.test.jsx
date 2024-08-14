import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from './UserContext'
import AppRoutes from './AppRoutes'

const context = {
  appliedJobIDs: new Set([1]),
  applyToJob: vi.fn(),
  currentUser: {
    username: 'testuser',
    firstName: 'First',
    lastname: 'Last',
    email: 'first@last.test',
    jobs: []
  }
};

describe('AppRoutes Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <AppRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <AppRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
