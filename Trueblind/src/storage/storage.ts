import { create } from 'zustand';
import { User } from '../interface/interfaceUser';



interface UserStore {
    user: User | null;
    setUser: (userData: User) => void;
    resetUser: () => void;
  }
  
  export const useUserStore = create<UserStore>((set) => ({
    user: null, 
    setUser: (userData) => set({ user: userData }), 
    resetUser: () => set({ user: null }), 
  }));