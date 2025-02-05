import { create } from 'zustand';
import { User, SearchResult } from '../interface/interfaceUser';

interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;

  resetUser: () => void;
  searchResults: SearchResult[];
  addSearchResult: (searchResult: SearchResult) => void;
  clearSearchResults: () => void;
  users: User[];
  likedUsers: User[];  
  addLikedUser: (user: User) => void;  
  removeLikedUser: (userId: string) => void;  
  setAllUsers: (users: User[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  users: [],
  likedUsers: [], 
  setAllUsers: (users) => set({ users }),

  addLikedUser: (user) => set((state) => ({
    likedUsers: [...state.likedUsers, user],  
  })),

  removeLikedUser: (userId: string) => set((state) => ({
    likedUsers: state.likedUsers.filter((user) => user.id !== userId),  
  })),

  setUser: (userData) => set({ user: userData }),
  resetUser: () => set({ user: null }),
  searchResults: [],
  addSearchResult: (searchResult) => set((state) => ({
    searchResults: [...state.searchResults, searchResult],
  })),
  clearSearchResults: () => set({ searchResults: [] }),
}));


