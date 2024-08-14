import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import SearchForm from './SearchForm'

describe('SearchForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <SearchForm fieldName="testfield" returnQuery={x => x} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <SearchForm fieldName="testfield" returnQuery={x => x} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
