'use server';

import { cookies } from 'next/headers';

export async function setCookie(key, value, maxAge = 60 * 60 * 48) {
  const cookieStore = await cookies();
  
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAge,
    path: '/',
  });
}

export async function getCookie(key) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  
  return cookie?.value;
}
