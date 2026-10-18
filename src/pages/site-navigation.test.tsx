import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import Index from './Index';
import { allArticles } from '@/lib/content';
import About from './About';
import Contact from './Contact';
afterEach(cleanup);
it('keeps the home page focused on research and links to separate information pages', () => {
  render(<Index />);
  const nav = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  expect(nav.getAllByRole('link').map(a => a.textContent)).toEqual(['AXIS11', 'Research', 'About', 'Contact']);
  expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', `${import.meta.env.BASE_URL}about/`);
  expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', `${import.meta.env.BASE_URL}contact/`);
  expect(screen.queryByRole('heading', { name: 'Greg Kang' })).not.toBeInTheDocument();
  expect(screen.getByText('Latest research')).toBeInTheDocument();
  const rows = screen.getByRole('list').children;
  expect(rows).toHaveLength(Math.min(10, allArticles.length));
  Element.prototype.scrollIntoView = vi.fn();
  if (allArticles.length > 10) {
  fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
  expect(screen.queryByText('Latest research')).not.toBeInTheDocument();
  expect(screen.getByRole('list').children).toHaveLength(Math.min(10, allArticles.length - 10));
  }
  fireEvent.click(nav.getByRole('button', { name: 'Toggle menu' }));
  expect(document.getElementById('mobile-navigation')?.textContent).toBe('ResearchAboutContact');
});
it('combines research approach and author on About', () => {
  render(<About />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Research. Perspective. Discussion.');
  expect(screen.getByRole('heading', { name: 'Greg Kang' })).toBeInTheDocument();
});
it('provides contact details on the Contact page', () => {
  render(<Contact />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get in Touch');
  expect(screen.getByRole('link', { name: 'Email Greg' })).toHaveAttribute('href', 'mailto:greg.kkang@gmail.com');
});
