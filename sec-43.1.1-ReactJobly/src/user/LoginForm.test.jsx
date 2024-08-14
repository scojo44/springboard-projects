import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import LoginForm from './LoginForm'

describe('LoginForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
