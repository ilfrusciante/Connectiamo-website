import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('renders Navbar with links', () => {
  render(<Navbar />);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
