import { createContext } from "react";
import { User } from "../interfaces/User";
import { CardRecFull } from "../interfaces/Card";
import { Logo } from "../interfaces/Logo";

export interface GlobalPropsType {
  isUserLogedin: boolean;
  setIsUsserLogedin: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  cardArray: CardRecFull[] | null;
  setCardArray: React.Dispatch<React.SetStateAction<CardRecFull[] | null>>;

  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;

  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;

  imageError: string[];
  setImageError: React.Dispatch<React.SetStateAction<string[]>>;
  addressError: string[];
  setAddressError: React.Dispatch<React.SetStateAction<string[]>>;

  logos: Logo[];
  imageUrls: { [key: string]: string };
}

export const GlobalProps = createContext<GlobalPropsType>({
  isUserLogedin: false,
  setIsUsserLogedin: () => {},
  token: "",
  setToken: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  cardArray: null,
  setCardArray: () => {},
  isDarkMode: false,
  setIsDarkMode: () => {},
  searchString: "",
  setSearchString: () => {},
  sort: "",
  setSort: () => {},
  imageError: [],
  setImageError: () => {},
  addressError: [],
  setAddressError: () => {},
  logos: [],
  imageUrls: {},
});
