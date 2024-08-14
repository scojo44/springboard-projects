import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext'
import JobCard from './JobCard'

const context = {
  appliedJobIDs: new Set([1]),
  applyToJob: vi.fn()
};

const TEST_JOB = {
  id: 1,
  title: 'Test Engineer',
  salary: 200000,
  equity: .05,
  companyHandle: 'test-corp',
};

describe('JobCard Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <JobCard job={TEST_JOB} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <JobCard job={TEST_JOB} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Shows some details for a job', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <JobCard job={TEST_JOB} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(getByText(TEST_JOB.title)).toBeInTheDocument();
    expect(getByText('200000')).toBeInTheDocument();
    expect(getByText('0.05')).toBeInTheDocument();
  });
});
