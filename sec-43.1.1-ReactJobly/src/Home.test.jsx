import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from './UserContext'
import Home from './Home'

const context = {
  currentUser: {firstName: 'Testuser'}
};

describe('Home Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Home />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Home />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
