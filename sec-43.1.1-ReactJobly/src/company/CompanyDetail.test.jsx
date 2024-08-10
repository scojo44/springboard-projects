import {getByAltText, render, waitForElementToBeRemoved} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import JoblyApi from '../api'
import CompanyDetail from './CompanyDetail'

const TEST_COMPANY = {
  handle: 'test-corp',
  name: 'Test Corp.',
  description: 'Test Corp is the leading.... yada yada yada',
  numEmployees: 5,
  logoURL: '/test-logo.png',
  jobs: []
}

// Mock the API hook
JoblyApi.getCompany = vi.fn(() => TEST_COMPANY);

describe('CompanyDetail Tests', () => {
  it('Renders without crashing', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <CompanyDetail company={TEST_COMPANY} />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
  });

  it('Matches snapshot', async () => {
    const {asFragment, getByText} = render(
      <MemoryRouter>
        <CompanyDetail company={TEST_COMPANY} />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('Shows a company', async () => {
    const {getByText, getByAltText} = render(
      <MemoryRouter>
        <CompanyDetail company={TEST_COMPANY} />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText(TEST_COMPANY.name)).toBeInTheDocument();
    expect(getByText(TEST_COMPANY.description)).toBeInTheDocument();
    expect(getByAltText(TEST_COMPANY.name + ' Logo')).toBeInTheDocument();
  });
});
