import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import JobCard from './JobCard';

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
        <JobCard job={TEST_JOB} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <JobCard job={TEST_JOB} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Shows some details for a job', async () => {
    const {getByText} = render(
      <MemoryRouter>
        <JobCard job={TEST_JOB} />
      </MemoryRouter>
    );

    expect(getByText(TEST_JOB.title)).toBeInTheDocument();
    expect(getByText('200000')).toBeInTheDocument();
    expect(getByText('0.05')).toBeInTheDocument();
  });
});
