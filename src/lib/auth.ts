'use client';

import { useState, useEffect } from 'react';

// Define types for user
interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

// Custom hook to get the user
export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return { user };
}

// Custom hook for sign in
export function useSignIn() {
  const signIn = async () => {
    return new Promise<void>((resolve) => {
      // Simulate authentication with dummy user data
      // Generate a unique user ID (for demonstration purposes)
      const userId = Math.random().toString(36).substring(2, 15);

      const dummyUser: User = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        imageUrl: 'https://picsum.photos/48/48', // Placeholder image
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(dummyUser));

      resolve();
    });
  };

  return { signIn };
}

// Custom hook for sign out
export function useSignOut() {
  const signOut = async () => {
    return new Promise<void>((resolve) => {
      // Remove user data from localStorage
      localStorage.removeItem('user');

      resolve();
    });
  };

  return { signOut };
}
