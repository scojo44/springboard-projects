import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext'
import NavBar from './NavBar'

const context = {
  currentUser: {username: 'testUser'}
};

describe('NavBar Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <NavBar />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <NavBar />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
