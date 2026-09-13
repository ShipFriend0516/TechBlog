import { act, render, screen } from '@testing-library/react';
import SeriesLoadMore from '../SeriesLoadMore';

jest.mock('../SeriesListEntry', () => ({
  __esModule: true,
  default: ({ item }: { item: { title: string } }) => <li>{item.title}</li>,
}));

let onIntersect: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    onIntersect = callback;
  }
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

beforeEach(() => {
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  global.fetch = jest.fn();
});

it('loads the next page once and removes IDs already shown in the server page', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      items: [
        { _id: 'initial', title: 'Duplicate' },
        { _id: 'next', title: 'Next series' },
      ],
      nextCursor: null,
    }),
  });

  render(
    <ul>
      <SeriesLoadMore
        initialCursor="first"
        initialCount={12}
        initialIds={['initial']}
      />
    </ul>
  );

  await act(async () => {
    onIntersect(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });

  expect(await screen.findByText('Next series')).toBeTruthy();
  expect(screen.queryByText('Duplicate')).toBeNull();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('더 많은 시리즈 불러오기')).toBeNull();
});
