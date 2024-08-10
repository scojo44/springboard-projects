import {render, waitForElementToBeRemoved} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import JoblyApi from '../api'
import CompanyList from './CompanyList'

const TEST_COMPANIES = [{
  handle: 'test-corp',
  name: 'Test Corp.',
  description: 'Test Corp is the leading.... yada yada yada',
  numEmployees: 5,
  logoURL: '/test-corp-logo.png',
  jobs: []
},
{
  handle: 'test-llc',
  name: 'Test LLC',
  description: 'Test LLC is the leading.... blah blah blah',
  numEmployees: 10,
  logoURL: '/test-llc-logo.png',
  jobs: []
}]

// Mock the API hook
JoblyApi.getCompanies = vi.fn(() => TEST_COMPANIES);

describe('CompanyList Tests', () => {
  it('Renders without crashing', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <CompanyList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
  });

  it('Matches snapshot', async () => {
    const {asFragment, getByText} = render(
      <MemoryRouter>
        <CompanyList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('Lists some companies', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <CompanyList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(getByText(TEST_COMPANIES[0].name)).toBeInTheDocument();
    expect(getByText(TEST_COMPANIES[0].description)).toBeInTheDocument();
    expect(getByText(TEST_COMPANIES[1].name)).toBeInTheDocument();
    expect(getByText(TEST_COMPANIES[1].description)).toBeInTheDocument();
  });
});
