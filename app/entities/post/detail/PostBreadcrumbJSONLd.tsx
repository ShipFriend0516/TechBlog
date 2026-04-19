interface Props {
  title: string;
  slug: string;
}

const PostBreadcrumbJSONLd = ({ title, slug }: Props) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'https://shipfriend.dev';

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Posts', item: `${baseUrl}/posts` },
      { '@type': 'ListItem', position: 3, name: title, item: `${baseUrl}/posts/${slug}` },
    ],
  }).replace(/<\//g, '<\\/');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default PostBreadcrumbJSONLd;
