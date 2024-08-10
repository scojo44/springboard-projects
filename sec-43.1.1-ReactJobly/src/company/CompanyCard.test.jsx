import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import CompanyCard from './CompanyCard';

const TEST_COMPANY = {
  handle: 'test-corp',
  name: 'Test Corp.',
  description: 'Test Corp is the leading.... yada yada yada',
  logoURL: '/test-logo.png'
}

describe('CompanyCard Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <CompanyCard company={TEST_COMPANY} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <CompanyCard company={TEST_COMPANY} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Shows some details for a company', async () => {
    const {getByText, getByAltText} = render(
      <MemoryRouter>
        <CompanyCard company={TEST_COMPANY} />
      </MemoryRouter>
    );

    expect(getByText(TEST_COMPANY.name)).toBeInTheDocument();
    expect(getByText(TEST_COMPANY.description)).toBeInTheDocument();
    expect(getByAltText(TEST_COMPANY.name + ' Logo')).toBeInTheDocument();
  });
});
