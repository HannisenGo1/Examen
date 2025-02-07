import { create } from 'zustand';
import { User, SearchResult, Message } from '../interface/interfaceUser';

export interface Request {
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Chat {
  chatRoomId: string; 
  userIds: string[];
  messages: Message[];
  userNames: string[];  
}

interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  resetUser: () => void;
  searchResults: SearchResult[];
  addSearchResult: (searchResult: SearchResult) => void;
  clearSearchResults: () => void;
  users: User[];
  likedUsers: User[];
  requests: Request[];
  addLikedUser: (user: User) => void;
  removeLikedUser: (userId: string) => void;
  setAllUsers: (users: User[]) => void;
  sendMessageRequest: (receiverId: string) => void;
  acceptMessageRequest: (senderId: string) => void;
  loadRequestsFromStorage: () => void;
  clearUserData: () => void;
  activeChats: Chat[];
  addMessageToChat: (receiverId: string, message: string) => void;
  loadChatsFromStorage: () => void;
}

export const useUserStore = create<UserStore>((set, get) => {
  //   ID och 'requests' för att lagra förfrågningarna
  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;

  return {
    user: null,
    users: [],
    likedUsers: [],
    requests: [],
    searchResults: [],
    activeChats: [],
    // Användaren och ladda deras data från localStorage
    setUser: (userData: User) => {
      const userId = userData.id || ''; 
      const userStorageKey = getUserStorageKey(userId, 'likedUsers');
      const storedLikedUsers = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      const storedChats = JSON.parse(localStorage.getItem(userStorageKey) || '[]');

      set({ user: userData, likedUsers: storedLikedUsers, activeChats: storedChats });
    },

    resetUser: () => set({ user: null, likedUsers: [] }),

    // Gillade användare
    addLikedUser: (user) => set((state) => {
      if (!state.user) return state; 

      const userId = state.user.id || ''; 
      const userStorageKey = getUserStorageKey(userId, 'likedUsers');
      const updatedLikedUsers = [...state.likedUsers, user];

      localStorage.setItem(userStorageKey, JSON.stringify(updatedLikedUsers));

      return { likedUsers: updatedLikedUsers };
    }),

    removeLikedUser: (userId: string) => set((state) => {
      if (!state.user) return state; 

      const userStorageKey = getUserStorageKey(state.user.id!, 'likedUsers');
      const updatedLikedUsers = state.likedUsers.filter((user) => user.id !== userId);

      localStorage.setItem(userStorageKey, JSON.stringify(updatedLikedUsers));

      return { likedUsers: updatedLikedUsers };
    }),

    addSearchResult: (searchResult) => set((state) => ({
      searchResults: [...state.searchResults, searchResult],
    })),
    
    clearSearchResults: () => set({ searchResults: [] }),

    sendMessageRequest: (receiverId: string) => {
      set((state) => {
        const senderId = state.user?.id || 'temp-user-id';  

        const newRequest = {
          senderId,
          receiverId,
          status: 'pending',
        };

        const userStorageKey = getUserStorageKey(receiverId, 'requests');
        const existingRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        const updatedRequests = [...existingRequests, newRequest];

        localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));

        return { requests: updatedRequests };
      });
    },

    acceptMessageRequest: (senderId: string) => {
      console.log("Accepterar förfrågan från:", senderId);
      set((state) => {
        const userId = state.user?.id || 'temp-user-id';
    
        // Uppdatera requests-status  'accepted' eller 'pending'
        const updatedRequests = state.requests.map((request) => {
          if (
            request.senderId === senderId &&
            request.receiverId === userId &&
            request.status === 'pending'
          ) {
            return { ...request, status: 'accepted' as 'accepted' };
          }
          return request;
        });

        const chatRoomId = [userId, senderId].sort().join('-'); 

        const currentUser = state.user;
        const senderUser = state.likedUsers.find((user) => user.id === senderId);

        const newChat: Chat = {
          chatRoomId,
          userIds: [userId, senderId],
          messages: [],
          userNames: [
            currentUser?.firstName || 'Du',
            senderUser?.firstName || 'Användare'
          ],
        };

        const updatedChats = [...state.activeChats, newChat];

        localStorage.setItem(getUserStorageKey(userId, 'requests'), JSON.stringify(updatedRequests));
        localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(updatedChats));
        console.log("Updated requests:", updatedRequests);
        return { requests: updatedRequests, activeChats: updatedChats };
      });
    },

    addMessageToChat: (chatRoomId: string, messageText: string) => {
      set((state) => {
        const updatedChats = state.activeChats.map((chat) => {
          if (chat.chatRoomId === chatRoomId) {
            const newMessage: Message = {
              senderId: state.user?.id || 'temp-user-id',
              senderName: state.user?.firstName || 'Anonym',
              text: messageText,
            };
            return { ...chat, messages: [...chat.messages, newMessage] };
          }
          return chat;
        });

        const userId = state.user?.id || 'temp-user-id';  
        localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(updatedChats));

        return { activeChats: updatedChats };
      });
    },

    loadChatsFromStorage: () => {
      const user = get().user;
      if (user) {
        const userStorageKey = getUserStorageKey(user.id!, 'activeChats');
        const storedChats = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        set({ activeChats: storedChats });
      }
    },

    loadRequestsFromStorage: () => {
      const user = get().user;
      if (user) {
        const userStorageKey = getUserStorageKey(user.id!, 'requests');
        const storedRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        set({ requests: storedRequests });
      }
    },

    rejectMessageRequest: (senderId: string) => {
      set((state) => {
        const userId = state.user?.id || 'temp-user-id'; 

        const updatedRequests: Request[] = state.requests.map((request) => {
          if (request.senderId === senderId && request.receiverId === userId && request.status === 'pending') {
            return { ...request, status: 'rejected' };  
          }
          return request;
        });
        localStorage.setItem(getUserStorageKey(userId, 'requests'), JSON.stringify(updatedRequests));

        return { requests: updatedRequests };
      });
    },

    clearUserData: () => {
      const user = get().user;
      if (user) {
        const userStorageKey = getUserStorageKey(user.id!, 'likedUsers');
        localStorage.removeItem(userStorageKey);  
        const requestStorageKey = getUserStorageKey(user.id!, 'requests');
        localStorage.removeItem(requestStorageKey); 
      }
    },

    setAllUsers: (users: User[]) => set({ users })
  };
});
