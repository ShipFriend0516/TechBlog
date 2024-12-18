export const getThumbnailInMarkdown = (content: string) => {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(regex);
  return match ? match[1] : null;
};
