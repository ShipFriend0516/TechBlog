import axios from 'axios';

export const getAllSeriesData = async (isPopulate: boolean = false) => {
  const response = await axios.get('/api/series', {
    params: {
      populate: isPopulate,
    },
  });
  return response.data;
};

export const getSeriesData = async (slug: string) => {
  const response = await axios.get(`/api/series/${slug}`);
  return response.data;
};

export const createSeries = async (data: {
  title: string;
  description?: string;
  thumbnailImage?: string;
  order?: string[];
  posts?: string[];
}) => {
  const response = await axios.post('/api/series', data);
  return response.data;
};

export const updateSeries = async (
  slug: string,
  data: {
    title: string;
    description: string;
    thumbnailImage: string;
    order: string[];
    posts: string[];
  }
) => {
  const response = await axios.put(`/api/series/${slug}`, data);
  return response.data;
};
