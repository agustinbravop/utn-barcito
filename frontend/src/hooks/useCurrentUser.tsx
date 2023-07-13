import { useEffect, useContext, createContext, useState } from "react";
import {
  readLocalStorage,
  writeLocalStorage,
} from "../utils/storage/localStorage";

interface ICurrentUserContext {
  currentUser?: string;
  logout: () => void;
  login: (username: string) => void;
  isAdmin: boolean;
}

interface CurrentUserProviderProps {
  children?: React.ReactNode;
}

const CurrentUserContext = createContext<ICurrentUserContext>({
  login: (username) => {},
  logout: () => {},
  isAdmin: false,
  currentUser: readLocalStorage<{ username: string }>("user")?.username,
});

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<string | undefined>(
    readLocalStorage<{ username: string }>("user")?.username
  );

  const updateCurrentUser = () => {
    const user = readLocalStorage<{ username: string }>("user");
    if (user) {
      setCurrentUser(user.username);
    } else {
      setCurrentUser(undefined);
    }
  };

  useEffect(() => {
    updateCurrentUser();
  }, []);

  const login = async (username: string) => {
    writeLocalStorage("user", {
      username,
    });
    setCurrentUser(username);
  };

  const logout = () => {
    writeLocalStorage("user", null);
    setCurrentUser(undefined);
  };

  const isAdmin = currentUser === "admin";

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, login, logout, isAdmin }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export const useCurrentUser = () => useContext(CurrentUserContext);
