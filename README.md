# Growth Tracker 🌱

読書・学習時間を一元管理し、自己成長を可視化するWebアプリ。

## デモ

- **URL:** https://growth-tracker-kohl.vercel.app/login
- **メール:** demodemo@email.com
- **パスワード:** demodemo@email.com

> ⚠️ デモアカウントは共有です。個人情報は入力しないでください。

---

## 概要

### ターゲット

読書や学習を習慣化したいが、記録が続かない人。

### 課題

- 読書記録と学習記録がバラバラで一元管理できない
- 継続できているかどうか可視化されていない
- メモや気づきを後から見返せない（どこにメモしていたかわからなくなる）

### 解決策

- 読書・学習を1つのアプリで記録し、ダッシュボードで成長を可視化する。
- 書籍ごとにメモ・タグ管理もできるので、後から振り返りやすい。

---

## 機能

- **認証:** メールアドレス・Googleアカウントでのログイン
- **ダッシュボード:** 今月の学習時間・今月の読書冊数・連続学習日数・総学習時間
- **読書管理:** 書籍検索（Google Books API）・本棚登録・読書ステータス管理
- **メモ・タグ:** 書籍ごとのメモ作成・タグ付け・重要メモ一覧
- **学習記録:** タイマー・手動入力でカテゴリ別に学習時間を記録
- **プロフィール:** アカウント名・表示名・アバター画像の設定

---

## アーキテクチャ図

![アーキテクチャ図](docs/images/architecture.png)

---

## ER図

```mermaid
erDiagram
  users {
    uuid id PK
    varchar email
    varchar encrypted_password
    timestamp created_at
    timestamp updated_at
  }
  profiles {
    uuid id PK
    uuid user_id FK
    varchar account_name
    varchar display_name
    text bio
    text avatar_url
    timestamp created_at
    timestamp updated_at
  }
  categories {
    uuid id PK
    varchar name
    timestamp created_at
    timestamp updated_at
  }
  books {
    uuid id PK
    varchar google_books_id
    text title
    varchar author
    text thumbnail_url
    varchar isbn
    int page_count
    text description
    timestamp created_at
    timestamp updated_at
  }
  user_books {
    uuid id PK
    uuid profile_id FK
    uuid book_id FK
    int status
    boolean is_favorite
    date started_at
    date finished_at
    int progress_page
    timestamp created_at
    timestamp updated_at
  }
  memos {
    uuid id PK
    uuid user_book_id FK
    text content
    boolean is_important
    int page_number
    timestamp created_at
    timestamp updated_at
  }
  tags {
    uuid id PK
    uuid profile_id FK
    varchar name
    varchar color
    timestamp created_at
    timestamp updated_at
  }
  memo_tags {
    uuid memo_id FK
    uuid tag_id FK
    timestamp created_at
    timestamp updated_at
  }
  studies {
    uuid id PK
    uuid profile_id FK
    uuid category_id FK
    int duration_minutes
    text note
    timestamp started_at
    timestamp ended_at
    timestamp created_at
    timestamp updated_at
  }
  
  users ||--|| profiles : "user_id"
  profiles ||--o{ user_books : "profile_id"
  books ||--o{ user_books : "book_id"
  user_books ||--o{ memos : "user_book_id"
  memos }o--o{ memo_tags : "memo_id"
  tags }o--o{ memo_tags : "tag_id"
  profiles ||--o{ tags : "profile_id"
  profiles ||--o{ studies : "profile_id"
  categories ||--o{ studies : "category_id"
```

---

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フロントエンド | Next.js 16 / TypeScript / Tailwind CSS v4 |
| バックエンド | Supabase（Auth・DB・Storage）/ Prisma ORM |
| グラフ | Recharts |
| デプロイ | Vercel |

---

## 外部API

| API | 用途 |
| --- | --- |
| Google Books API | 書籍検索・書影取得 |
| Supabase Auth | メール・Google認証 |
| Supabase Storage | アバター画像の保存 |

---

## ローカル開発

```bash
git clone https://github.com/Rio-Sasaki/Growth-Tracker.git
cd Growth-Tracker
npm install
```

`.env.local` を作成して以下の環境変数を設定してください。

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=
```

`.env` を作成して以下の環境変数を設定してください。

```
DATABASE_URL=
DIRECT_URL=
```

```bash
npx prisma generate
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアクセス