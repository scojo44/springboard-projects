import {render, waitForElementToBeRemoved} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import JoblyApi from '../api'
import JobList from './JobList'

const TEST_JOBS = [{
  id: 1,
  title: 'Test Engineer',
  salary: 200000,
  equity: .05,
  companyHandle: 'test-corp',
},
{
  id: 2,
  title: 'Test Developer',
  salary: 150000,
  equity: .1,
  companyHandle: 'test-llc',
}];

// Mock the API hook
JoblyApi.getJobs = vi.fn(() => TEST_JOBS);

describe('JobList Tests', () => {
  it('Renders without crashing', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <JobList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
  });

  it('Matches snapshot', async () => {
    const {asFragment, getByText} = render(
      <MemoryRouter>
        <JobList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('Lists some jobs', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <JobList />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(getByText('Loading...'));
    expect(getByText(TEST_JOBS[0].title)).toBeInTheDocument();
    expect(getByText('200000')).toBeInTheDocument();
    expect(getByText('0.05')).toBeInTheDocument();
    expect(getByText(TEST_JOBS[1].title)).toBeInTheDocument();
    expect(getByText('150000')).toBeInTheDocument();
    expect(getByText('0.1')).toBeInTheDocument();
  });
});
