export const env = {
    API_BASE_URL: process.env.VITE_BASE_URL ?? "http://localhost:8080/api",
  };

  it('dummy test to avoid Jest error', () => {
    expect(true).toBeTruthy();
  });
  