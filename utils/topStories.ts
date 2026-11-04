import type { Article } from "~/models";

/** Shape consumed by StoryCard and the story modal. */
export interface TopStory {
  id: string | number;
  title: string;
  category: string;
  categoryColor: string;
  excerpt: string;
  image: string | null;
  content: string;
  isFeatured: boolean;
  isVideo: boolean;
}

/** Maps a raw `news-papers/get-top-stories` article into a display-ready story. */
export const mapTopStoryArticle = (article: Article): TopStory => {
  const plainText = article.attributes.text ? article.attributes.text.replace(/<[^>]*>?/gm, '') : '';
  const excerpt = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

  const image = article.attributes.images?.image_intro || article.attributes.images?.image_fulltext || null;

  return {
    id: article.id,
    title: article.attributes.title,
    category: 'News',
    categoryColor: 'blue',
    excerpt,
    image,
    content: article.attributes.text,
    isFeatured: article.attributes.featured === 1,
    isVideo: false,
  };
};
