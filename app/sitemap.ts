import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://shunkan-tap.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://shunkan-tap.vercel.app/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://shunkan-tap.vercel.app/legal', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
