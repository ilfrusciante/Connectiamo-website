import { render, screen } from '@testing-library/react';
import ProfileCard from '../components/ProfileCard';

test('renders ProfileCard with nickname', () => {
  render(<ProfileCard nickname="Mario" />);
  expect(screen.getByText(/Mario/)).toBeInTheDocument();
});
