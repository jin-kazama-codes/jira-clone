"use client";
import { useAuthModalContext } from "@/context/use-auth-modal";
import { useCookie } from "./use-cookie";

export const useIsAuthenticated = (): [string | undefined, () => void] => {
  const user = useCookie('user');
  const { setAuthModalIsOpen } = useAuthModalContext();

  function openAuthModal() {
    setAuthModalIsOpen(true);
  }

  return [user?.id, openAuthModal];
};
