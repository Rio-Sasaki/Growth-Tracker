import { useState, useEffect } from 'react';
import { searchBooks, GoogleBook } from '@/lib/google-books';

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

type ImportantMemo = {
  id: string;
  content: string;
  page_number: number | null;
  memo_tags: { tags: { id: string; name: string; color: string } }[];
  user_books: {
    id: string;
    books: {
      title: string;
      thumbnail_url: string | null;
    };
  };
};

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

type Tab = 'search' | 'list' | 'important';
type StatusFilter = 0 | 1 | 2 | -1;

const STATUS_FILTERS: [StatusFilter, string][] = [
  [-1, 'すべて'],
  [0, '未読'],
  [1, '読書中'],
  [2, '読了'],
];

export function useBooks() {
  const [tab, setTab] = useState<Tab>('list');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(-1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchKeywordInput, setSearchKeywordInput] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [importantMemos, setImportantMemos] = useState<ImportantMemo[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('/api/books');
      const data = await res.json();
      setUserBooks(data.userBooks ?? []);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (tab === 'important') {
      const fetchImportantMemos = async () => {
        const res = await fetch('/api/important-memos');
        const data = await res.json();
        setImportantMemos(data.memos ?? []);
      };
      fetchImportantMemos();
    }
  }, [tab]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearchLoading(true);
    const books = await searchBooks(query);
    setResults(books);
    setSearchLoading(false);
  };

  const handleFilterSearch = async () => {
    setFilterLoading(true);
    setSearchKeyword(searchKeywordInput);
    setFilterLoading(false);
  };

  const handleRegister = async (book: GoogleBook) => {
    const info = book.volumeInfo;
    const isbn = info.industryIdentifiers?.find(
      (i) => i.type === 'ISBN_13'
    )?.identifier;

    setRegisteringId(book.id);

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
    setRegisteringId(null);

    if (res.status === 409) {
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

    setUserBooks((prev) => [data.userBook, ...prev]);
    setToast({ message: `「${info.title}」を登録しました`, type: 'success' });
  };

  const isRegistered = (book: GoogleBook) => {
    return userBooks.some((ub) => ub.books.google_books_id === book.id);
  };

  const filteredBooks = userBooks
    .filter((ub) => statusFilter === -1 || ub.status === statusFilter)
    .filter(
      (ub) =>
        ub.books.title.includes(searchKeyword) ||
        (ub.books.author ?? '').includes(searchKeyword)
    );

  return {
    tab,
    setTab,
    query,
    setQuery,
    results,
    searchLoading,
    statusFilter,
    setStatusFilter,
    searchKeywordInput,
    setSearchKeywordInput,
    filterLoading,
    userBooks,
    importantMemos,
    registeringId,
    toast,
    setToast,
    filteredBooks,
    STATUS_FILTERS,
    handleSearch,
    handleFilterSearch,
    handleRegister,
    isRegistered,
  };
}
