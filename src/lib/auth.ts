'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL + '/api/auth/callback/google'
);

async function getGoogleAuthURL() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    response_type: 'code',
    scope: scopes,
  });

  return url;
}

export async function signIn() {
  const googleAuthURL = await getGoogleAuthURL();
  redirect(googleAuthURL);
}

export async function signOut() {
  cookies().delete('user');
  redirect('/');
}

export async function getSession() {
  const user = cookies().get('user')?.value;
  if (!user) return null;
  return JSON.parse(user);
}

export async function getUserProfile(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });
  const userInfo = await oauth2.userinfo.get();

  return {
    ...userInfo.data,
    tokens,
  };
}
