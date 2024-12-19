export const createPostSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
