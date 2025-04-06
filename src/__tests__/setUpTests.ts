import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe(): void { console.log('ResizeObserver: observe called'); }
  unobserve(): void { console.log('ResizeObserver: unobserve called'); }
  disconnect(): void { console.log('ResizeObserver: disconnect called'); }
} as unknown as typeof ResizeObserver;

it('dummy test to avoid Jest error', () => {
  expect(true).toBeTruthy();
});
