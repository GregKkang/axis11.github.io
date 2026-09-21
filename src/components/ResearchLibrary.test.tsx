import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import ResearchLibrary from './ResearchLibrary';

vi.mock('@/lib/content', () => ({
  allArticles: Array.from({ length: 23 }, (_, i) => ({
    slug: `note-${i}`, category: i < 12 ? 'technology' : 'commodities',
    date: `2026-09-${String(23 - i).padStart(2, '0')}`, tags: [i === 22 ? 'unique-tag' : 'markets'],
    primaryLang: 'en', languages: ['en'],
    versions: { en: { title: `Note ${i}`, summary: 'Research summary' } },
  })),
  allCategories: [{ slug: 'technology', title: 'Technology' }, { slug: 'commodities', title: 'Commodities' }],
  articleUrl: (article: { slug: string }) => `/research/${article.slug}/`,
  formatDate: (date: string) => date,
  LANGUAGE_LABELS: { en: 'English' },
}));
afterEach(cleanup);
it('shows 10, 10 and 3 articles with numbered pages and navigation boundaries', () => {
  Element.prototype.scrollIntoView = vi.fn();
  render(<ResearchLibrary />);
  const rows = () => within(screen.getByRole('list')).getAllByRole('listitem');
  expect(rows()).toHaveLength(10);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
  expect(rows()).toHaveLength(10);
  expect(screen.getByText('Note 10')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(rows()).toHaveLength(3);
  expect(screen.getByRole('status')).toHaveTextContent('21–23 of 23 articles');
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
});
it('filters all articles before pagination, resets page, and hides pagination for short results', () => {
  render(<ResearchLibrary />);
  fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'unique-tag' } });
  expect(screen.getByText('Note 22')).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Research pagination' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'technology' } });
  expect(screen.getByRole('status')).toHaveTextContent('1–10 of 12 articles');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nothing-matches' } });
  expect(screen.getByText('No matching articles')).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Research pagination' })).not.toBeInTheDocument();
});
