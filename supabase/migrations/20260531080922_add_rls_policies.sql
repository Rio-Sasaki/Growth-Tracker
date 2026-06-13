-- profiles ポリシー
create policy "自分のプロフィールのみ参照可能"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "自分のプロフィールのみ作成可能"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "自分のプロフィールのみ更新可能"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "自分のプロフィールのみ削除可能"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- categories ポリシー（全ユーザーが参照可能、追加・更新・削除は不可）
create policy "カテゴリは全ユーザーが参照可能"
  on public.categories for select
  using (true);

-- books ポリシー（全ユーザーが参照・作成可能）
create policy "書籍は全ユーザーが参照可能"
  on public.books for select
  using (true);

create policy "書籍は全ユーザーが作成可能"
  on public.books for insert
  with check (true);

create policy "書籍は全ユーザーが更新可能"
  on public.books for update
  using (true);

-- user_books ポリシー
create policy "自分の本棚のみ参照可能"
  on public.user_books for select
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の本棚のみ作成可能"
  on public.user_books for insert
  with check (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の本棚のみ更新可能"
  on public.user_books for update
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の本棚のみ削除可能"
  on public.user_books for delete
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

-- memos ポリシー
create policy "自分のメモのみ参照可能"
  on public.memos for select
  using (user_book_id in (
    select id from public.user_books
    where profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "自分のメモのみ作成可能"
  on public.memos for insert
  with check (user_book_id in (
    select id from public.user_books
    where profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "自分のメモのみ更新可能"
  on public.memos for update
  using (user_book_id in (
    select id from public.user_books
    where profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "自分のメモのみ削除可能"
  on public.memos for delete
  using (user_book_id in (
    select id from public.user_books
    where profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  ));

-- tags ポリシー
create policy "自分のタグのみ参照可能"
  on public.tags for select
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分のタグのみ作成可能"
  on public.tags for insert
  with check (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分のタグのみ更新可能"
  on public.tags for update
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分のタグのみ削除可能"
  on public.tags for delete
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

-- memo_tags ポリシー
create policy "自分のメモタグのみ参照可能"
  on public.memo_tags for select
  using (memo_id in (
    select id from public.memos
    where user_book_id in (
      select id from public.user_books
      where profile_id in (
        select id from public.profiles where user_id = auth.uid()
      )
    )
  ));

create policy "自分のメモタグのみ作成可能"
  on public.memo_tags for insert
  with check (memo_id in (
    select id from public.memos
    where user_book_id in (
      select id from public.user_books
      where profile_id in (
        select id from public.profiles where user_id = auth.uid()
      )
    )
  ));

create policy "自分のメモタグのみ削除可能"
  on public.memo_tags for delete
  using (memo_id in (
    select id from public.memos
    where user_book_id in (
      select id from public.user_books
      where profile_id in (
        select id from public.profiles where user_id = auth.uid()
      )
    )
  ));

-- studies ポリシー
create policy "自分の学習記録のみ参照可能"
  on public.studies for select
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の学習記録のみ作成可能"
  on public.studies for insert
  with check (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の学習記録のみ更新可能"
  on public.studies for update
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "自分の学習記録のみ削除可能"
  on public.studies for delete
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));