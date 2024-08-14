import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <LoadingIndicator />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <LoadingIndicator />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
