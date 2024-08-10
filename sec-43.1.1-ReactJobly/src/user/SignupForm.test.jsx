import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import SignupForm from './SignupForm';

describe('SignupForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
