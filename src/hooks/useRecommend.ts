import { useState } from 'react';
import { searchBooks } from '@/lib/google-books';

type Recommendation = {
  title: string;
  author: string;
  reason: string;
};

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

type UserBook = {
  id: string;
  status: number;
  is_favorite: boolean;
  books: {
    id: string;
    title: string;
    author: string | null;
    thumbnail_url: string | null;
    google_books_id: string | null;
  };
};

export function useRecommend(
  userBooks: UserBook[],
  setUserBooks: React.Dispatch<React.SetStateAction<UserBook[]>>,
  setToast: React.Dispatch<React.SetStateAction<ToastState>>
) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [registeredTitles, setRegisteredTitles] = useState<string[]>([]);
  const [registeringFromRecommend, setRegisteringFromRecommend] = useState<
    string | null
  >(null);

  const handleRecommend = async () => {
    setRecommendLoading(true);
    const res = await fetch('/api/ai/book-recommend');
    const data = await res.json();
    if (data.recommendations) {
      setRecommendations(data.recommendations);
    }
    setRecommendLoading(false);
  };

  const handleRegisterFromRecommend = async (title: string, author: string) => {
    setRegisteringFromRecommend(title);

    const books = await searchBooks(`${title} ${author}`);
    if (books.length === 0) {
      setToast({ message: '書籍が見つかりませんでした', type: 'error' });
      setRegisteringFromRecommend(null);
      return;
    }

    const book = books[0];
    const info = book.volumeInfo;
    const isbn = info.industryIdentifiers?.find(
      (i) => i.type === 'ISBN_13'
    )?.identifier;

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleBooksId: book.id,
        title: info.title,
        author: info.authors?.join(', '),
        thumbnailUrl: info.imageLinks?.thumbnail,
        isbn,
        pageCount: info.pageCount,
        description: info.description,
      }),
    });

    const data = await res.json();
    setRegisteringFromRecommend(null);

    if (res.status === 409) {
      setRegisteredTitles((prev) => [...prev, title]);
      setToast({
        message: 'この書籍はすでに本棚に登録されています',
        type: 'error',
      });
      return;
    }

    if (!res.ok) {
      setToast({ message: '登録に失敗しました', type: 'error' });
      return;
    }

    setRegisteredTitles((prev) => [...prev, title]);
    setUserBooks((prev) => [data.userBook, ...prev]);
    setToast({
      message: `「${info.title}」を本棚に追加しました`,
      type: 'success',
    });
  };

  const isRecommendationRegistered = (title: string) => {
    return (
      registeredTitles.includes(title) ||
      userBooks.some((ub) => ub.books.title === title)
    );
  };

  return {
    recommendations,
    recommendLoading,
    registeringFromRecommend,
    handleRecommend,
    handleRegisterFromRecommend,
    isRecommendationRegistered,
  };
}
