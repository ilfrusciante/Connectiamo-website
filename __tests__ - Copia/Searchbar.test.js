import { render, screen } from '@testing-library/react';
import Searchbar from '../components/Searchbar';

test('renders Searchbar with filters', () => {
  render(<Searchbar />);
  expect(screen.getByPlaceholderText(/cerca/i)).toBeInTheDocument();
});
