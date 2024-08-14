import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from './UserContext'
import UserRoutes from './UserRoutes'

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

describe('UserRoutes Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <UserRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <UserRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
