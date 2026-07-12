import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json(
      { error: 'ファイルがありません' },
      { status: 400 }
    );
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.log('uploadError:', uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  try {
    await prisma.profiles.upsert({
      where: { user_id: user.id },
      update: { avatar_url: publicUrl },
      create: { user_id: user.id, avatar_url: publicUrl },
    });
  } catch (e) {
    console.log('prisma error:', e);
    return NextResponse.json(
      { error: 'プロフィール更新に失敗しました' },
      { status: 500 }
    );
  }

  return NextResponse.json({ avatarUrl: publicUrl });
}

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const profile = await prisma.profiles.findUnique({
    where: { user_id: user.id },
  });

  if (!profile?.avatar_url) {
    return NextResponse.json({ error: '画像がありません' }, { status: 400 });
  }

  const url = new URL(profile.avatar_url);
  const filePath = url.pathname.split('/avatars/')[1];

  await supabase.storage.from('avatars').remove([filePath]);

  await prisma.profiles.update({
    where: { user_id: user.id },
    data: { avatar_url: null },
  });

  return NextResponse.json({ success: true });
}
