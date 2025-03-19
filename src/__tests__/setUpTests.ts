import '@testing-library/jest-dom';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

it('dummy test to avoid Jest error', () => {
  expect(true).toBeTruthy();
});
