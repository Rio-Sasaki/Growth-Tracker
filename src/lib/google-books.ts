export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    pageCount?: number;
  };
};

export const searchBooks = async (query: string): Promise<GoogleBook[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=ja`
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.items ?? [];
};
