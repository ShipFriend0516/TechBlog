// HTML 파일로 부터 메타데이터 파싱
const getMeta = (html: string, prop: string): string | null => {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']*)["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${prop}["']`,
      'i'
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return null;
};

// Open Graph API 엔드포인트
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ error: 'url required' }, { status: 400 });

  try {
    new URL(url);
  } catch {
    return Response.json({ error: 'invalid url' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok)
      return Response.json({ error: 'fetch failed' }, { status: 502 });

    const html = await res.text();
    const urlObj = new URL(url);

    const title =
      getMeta(html, 'og:title') ||
      getMeta(html, 'twitter:title') ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      null;

    const description =
      getMeta(html, 'og:description') ||
      getMeta(html, 'twitter:description') ||
      getMeta(html, 'description') ||
      null;

    const image =
      getMeta(html, 'og:image') ||
      getMeta(html, 'twitter:image:src') ||
      getMeta(html, 'twitter:image') ||
      null;

    const siteName = getMeta(html, 'og:site_name') || null;

    const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

    return Response.json(
      {
        url,
        title,
        description,
        image,
        siteName,
        favicon,
        hostname: urlObj.hostname,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch {
    return Response.json({ error: 'fetch failed' }, { status: 502 });
  }
};
