import { create } from 'zustand';
import { User, SearchResult, Message,Chat } from '../interface/interfaceUser';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../components/data/firebase';
import { v4 as uuidv4 } from 'uuid'; 
export interface Request {
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}



export interface UserStore {
 user: User | null;
 setUser: (userData: User) => void;
users: User[],
setUsers: (users: User[]) => void;
  searchResults: SearchResult[];
  addSearchResult: (searchResult: SearchResult) => void;
  clearSearchResults: () => void;
  likedUsers: User[];
  requests: Request[];
  addLikedUser: (user: User) => void;
  removeLikedUser: (userId: string) => void;
  sendMessageRequest: (receiverId: string) => void;
  acceptMessageRequest: (senderId: string) => void;
  loadRequestsFromStorage: () => void;
  activeChats: Chat[];
  loadChatsFromStorage: () => void;
loadUserFromStorage: () => void
  deniedUsers: User[];
  addDenyUsers: (user:User) => void;
  resetDenyUsers: () => void;
  loadDeniedUsersFromStorage: () => void;
  token: string | null;
  setToken: (token: string | null) => void
  chats: Chat[]
  setChats: (chats: Chat[]) => void  
  hasUsedPromoCode: boolean; 
  updatePromoCodeStatus: (hasUsedPromoCode: boolean) => void;
}

export const useUserStore = create<UserStore>((set, get) => {
  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;

  return {
    user: null,
    users: [],
    likedUsers: [],
    requests: [],
    searchResults: [],
    activeChats: [],
    seenUsers: [],
   deniedUsers:[],
   hasUsedPromoCode: false,
   setUsers: (users) => set({ users }),
   token: localStorage.getItem("authToken"), 
   chats: [],
 
  
   setChats: (chats: Chat[]) => set({ chats }),

   setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("authToken", token);  
    } else {
      localStorage.removeItem("authToken");
    }
    set({ token });
  },
  setUser: (userData: User) => {
   
    const userId = userData.id ?? 'temp-user-id';
    const userStorageKey = getUserStorageKey(userId, 'likedUsers');
    const storedLikedUsers = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
    const storedChats = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'activeChats')) || '[]');
    const storedRequests = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'requests')) || '[]');
    const userDeniedKey = getUserStorageKey(userId, 'deniedUsers');
    const storedDeniedUsers = JSON.parse(localStorage.getItem(userDeniedKey) || '[]');
    const storedUserData = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'user')) || '{}');
    set({
      user: userData,
      likedUsers: storedLikedUsers,
      activeChats: storedChats,
      requests: storedRequests,
      deniedUsers: storedDeniedUsers,
      hasUsedPromoCode: storedUserData.hasUsedPromoCode || false
    });
  },
  updatePromoCodeStatus: (hasUsedPromoCode: boolean) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ hasUsedPromoCode });

    const updatedUser = { ...currentUser, hasUsedPromoCode };
    localStorage.setItem(getUserStorageKey(currentUser.id!, 'user'), JSON.stringify(updatedUser));
  },

  purchaseEmoji: (emoji: string, price: number) => {
    const currentUser = get().user;
    if (!currentUser) return;

    if (currentUser.credits < price) {
      return;
    }

    const updatedCredits = currentUser.credits - price;
    const emojiIndex = currentUser.purchasedEmojis.findIndex((e) => e.emoji === emoji);
    let updatedPurchasedEmojis = [...currentUser.purchasedEmojis];

    if (emojiIndex !== -1) {
      updatedPurchasedEmojis[emojiIndex].count += 1;
    } else {
      updatedPurchasedEmojis.push({ emoji, count: 1 });
    }

    const updatedUser = { ...currentUser, credits: updatedCredits, purchasedEmojis: updatedPurchasedEmojis };
    set({ user: updatedUser });

    const userId = updatedUser.id || '';
    localStorage.setItem(getUserStorageKey(userId, 'credits'), JSON.stringify(updatedCredits));
    localStorage.setItem(getUserStorageKey(userId, 'purchasedEmojis'), JSON.stringify(updatedPurchasedEmojis));
  },

    // Återställ (rensa) listan med nekade användare
    resetDenyUsers: async () => {
      set({ deniedUsers: [] });
  
      const userId = get().user?.id ?? 'temp-user-id';
      localStorage.removeItem(getUserStorageKey(userId, 'deniedUsers'));
      const userRef = doc(db, 'users', userId);
    
      try {
        await updateDoc(userRef, {
          denylist: [] 
        });
    
      } catch (error) {
        console.error('Kunde inte återställa denylist i Firebase:', error);
      }
    },

   
    addDenyUsers: async (userToDeny) => {
      const currentUser = get().user;
      if (!currentUser) return;
  
      const updatedDeniedUsers = [...get().deniedUsers, userToDeny];
      const userStorageKey = getUserStorageKey(currentUser.id!, 'deniedUsers');
      localStorage.setItem(userStorageKey, JSON.stringify(updatedDeniedUsers));
      
      set({ deniedUsers: updatedDeniedUsers });
  
  
      const userRef = doc(db, 'users', currentUser.id);
  
      try {
        await updateDoc(userRef, {
          denylist: updatedDeniedUsers,
        });
      } catch (error) {
        console.error("Fel vid uppdatering av denylist i Firestore:", error);
      }
    },

    addLikedUser: (user) => {
      const currentUser = get().user;
      if (!currentUser) return;

      const userStorageKey = getUserStorageKey(currentUser.id!, 'likedUsers');
      const updatedLikedUsers = [...get().likedUsers, user];

      localStorage.setItem(userStorageKey, JSON.stringify(updatedLikedUsers));
      set({ likedUsers: updatedLikedUsers });
    },

    removeLikedUser: (userId: string) => {
      const currentUser = get().user;
      if (!currentUser) return;

      const userStorageKey = getUserStorageKey(currentUser.id!, 'likedUsers');
      const updatedLikedUsers = get().likedUsers.filter((user) => user.id !== userId);

      localStorage.setItem(userStorageKey, JSON.stringify(updatedLikedUsers));
      set({ likedUsers: updatedLikedUsers });
    },

    addSearchResult: (searchResult) => {
      set({ searchResults: [...get().searchResults, searchResult] });
    },

    clearSearchResults: () => {
      set({ searchResults: [] });
    },

    sendMessageRequest: (receiverId: string) => {
      const senderId = get().user?.id || 'temp-user-id';
      const newRequest: Request = {
        senderId,
        receiverId,
        status: 'pending',
      };
    
      const userStorageKey = getUserStorageKey(senderId, 'requests');
      const storedRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      storedRequests.push(newRequest);
      localStorage.setItem(userStorageKey, JSON.stringify(storedRequests));
    
      const receiverStorageKey = getUserStorageKey(receiverId, 'requests');
      const receiverRequests = JSON.parse(localStorage.getItem(receiverStorageKey) || '[]');
      receiverRequests.push(newRequest);
      localStorage.setItem(receiverStorageKey, JSON.stringify(receiverRequests));
    
      set((state) => {
        const updatedRequests = [...state.requests, newRequest];
        return { requests: updatedRequests };
      });
    },
  // Acceptera en chat request 
  acceptMessageRequest: (senderId: string) => {
    set((state) => {
      const userId = state.user?.id || 'temp-user-id';
  
      const updatedRequests = state.requests.map((request) => {
        if (request.senderId === senderId && request.receiverId === userId && request.status === 'pending') {
          return { ...request, status: 'accepted' as 'accepted' };
        }
        return request;
      });
  
      const userStorageKey = getUserStorageKey(userId, 'requests');
      localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));
  
      const chatRoomId = uuidv4(); 
      const currentUser = state.user;
      const senderUser = state.likedUsers.find((user) => user.id === senderId);
  
      if (!currentUser || !senderUser) return { requests: updatedRequests };
  
      const newChat: Chat = {
        chatRoomId,
        userIds: [userId, senderId],
        userNames: [currentUser.firstName || 'Du', senderUser.firstName || 'Användare'],
        messages: [],
      };
  
      const firstMessage: Message = {
        id: new Date().toISOString(),
        senderId: userId,
        senderName: currentUser.firstName || 'Du',
        message: 'Hej, trevligt att matcha!',
        timestamp: new Date().toISOString(),
      };
  
      newChat.messages.push(firstMessage);
  
      const updatedChats = [...state.activeChats, newChat];
      localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(updatedChats));
  
      const otherUserChats = JSON.parse(localStorage.getItem(getUserStorageKey(senderId, 'activeChats')) || '[]');
      const updatedOtherUserChats = [...otherUserChats, newChat];
      localStorage.setItem(getUserStorageKey(senderId, 'activeChats'), JSON.stringify(updatedOtherUserChats));
  
      return { requests: updatedRequests, activeChats: updatedChats };
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
    setActiveChats: (chats: Chat[]) => {
      set({ activeChats: chats });
      const userId = get().user?.id;
      if (userId) {
        localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(chats));
      }
    },
    
    loadRequestsFromStorage: () => {
      const user = get().user;
      if (!user) {
    
        return;
      }
    
      const userStorageKey = getUserStorageKey(user.id!, 'requests');

    
      const storedRequestsRaw = localStorage.getItem(userStorageKey);
   
    
      if (storedRequestsRaw) {
        const storedRequests = JSON.parse(storedRequestsRaw);

        set({ requests: storedRequests });
      } else {

        set({ requests: [] });
      }
    },

    rejectMessageRequest: (senderId: string) => {
      const userId = get().user?.id || 'temp-user-id';
    
      const updatedRequests = get().requests.map((request) => {
        if (request.senderId === senderId && request.receiverId === userId && request.status === 'pending') {
          return { ...request, status: 'rejected' as 'rejected' };  
        }
        return request;
      });

      localStorage.setItem(getUserStorageKey(userId, 'requests'), JSON.stringify(updatedRequests));
  
      set({ requests: updatedRequests });
    },
    loadDeniedUsersFromStorage: () => {
      const currentUser = get().user;
      if (!currentUser) return;
    
      const userStorageKey = getUserStorageKey(currentUser.id!, 'deniedUsers');
      const storedDeniedUsers = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
    
      set({ deniedUsers: storedDeniedUsers });
    },
    loadUserFromStorage: () => {
      const userStorageKey = getUserStorageKey(get().user?.id ?? '', 'user');
      const storedUser = localStorage.getItem(userStorageKey);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        set({ user: parsedUser });
      } else {

      }
    },

  };
});
