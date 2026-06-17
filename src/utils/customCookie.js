'use server';

import { cookies } from "next/headers";

export async function getCookie(key) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);

  return cookie?.value;
}

