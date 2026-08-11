"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCart } from "@/context/CartContext";
import { AccountOrder, AccountReview, MenuItem, UserProfile } from "@/types";

interface AccountContextType {
  profile: UserProfile | null;
  favorites: string[];
  reviews: AccountReview[];
  isSignedIn: boolean;
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => void;
  removeReview: (reviewId: string) => void;
  updateReview: (reviewId: string, patch: Partial<AccountReview>) => void;
  reorder: (order: AccountOrder, menuItems: MenuItem[]) => void;
  deleteAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: React.ReactNode;
  initialReviews?: AccountReview[];
}

export function AccountProvider({
  children,
  initialReviews = [],
}: AccountProviderProps) {
  const { addToCart } = useCart();
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(
    "tikkay-account-profile",
    null,
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "tikkay-account-favorites",
    [],
  );
  const [reviews, setReviews] = useLocalStorage<AccountReview[]>(
    "tikkay-account-reviews",
    initialReviews,
  );

  const signIn = useCallback(
    (user: UserProfile) => setProfile(user),
    [setProfile],
  );

  const signOut = useCallback(() => setProfile(null), [setProfile]);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    [setProfile],
  );

  const isFavorite = useCallback(
    (itemId: string) => favorites.includes(itemId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (itemId: string) => {
      setFavorites((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId],
      );
    },
    [setFavorites],
  );

  const removeReview = useCallback(
    (reviewId: string) => {
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    },
    [setReviews],
  );

  const updateReview = useCallback(
    (reviewId: string, patch: Partial<AccountReview>) => {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, ...patch } : review,
        ),
      );
    },
    [setReviews],
  );

  const reorder = useCallback(
    (order: AccountOrder, menuItems: MenuItem[]) => {
      for (const line of order.items) {
        const menuItem = menuItems.find((item) => item.id === line.itemId);
        if (menuItem) {
          for (let i = 0; i < line.quantity; i += 1) {
            addToCart(menuItem);
          }
        }
      }
    },
    [addToCart],
  );

  const deleteAccount = useCallback(() => {
    setProfile(null);
    setFavorites([]);
    setReviews([]);
  }, [setProfile, setFavorites, setReviews]);

  return (
    <AccountContext.Provider
      value={{
        profile,
        favorites,
        reviews,
        isSignedIn: profile !== null,
        signIn,
        signOut,
        updateProfile,
        isFavorite,
        toggleFavorite,
        removeReview,
        updateReview,
        reorder,
        deleteAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
