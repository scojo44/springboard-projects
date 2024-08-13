import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ProfileForm from './ProfileForm';

describe('ProfileForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
