export const GET = () => {
  const content = 'google-site-verification: googlee045d7c5db6fc750.html';

  return new Response(content, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
