export const GET = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const slug = pathname.split('/').pop();
  try {
  } catch (error) {
    return new Response('Error fetching portfolio', { status: 500 });
  }
};
