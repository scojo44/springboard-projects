import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import EditProfileForm from './EditProfileForm';

describe('EditProfileForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <EditProfileForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <EditProfileForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
