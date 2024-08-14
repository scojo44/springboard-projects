import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import Alert from './Alert'

describe('Alert Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <Alert type="success" messages={['test alert']} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <Alert type="success" messages={['test alert']} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
