import { create } from 'zustand';
import { User, SearchResult, Message,Chat } from '../interface/interfaceUser';

export interface Request {
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}



export interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  setUsers: (users:User[]) => void
  resetUser: () => void;
  searchResults: SearchResult[];
  addSearchResult: (searchResult: SearchResult) => void;
  clearSearchResults: () => void;
  users: User[];
  likedUsers: User[];
  requests: Request[];
  addLikedUser: (user: User) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  removeLikedUser: (userId: string) => void;
  setAllUsers: (users: User[]) => void;
  sendMessageRequest: (receiverId: string) => void;
  acceptMessageRequest: (senderId: string) => void;
  loadRequestsFromStorage: () => void;
  activeChats: Chat[];
  loadChatsFromStorage: () => void;
  loadUserFromStorage: () => void;
  deniedUsers: User[];
  addDenyUsers: (user:User) => void;
  resetDenyUsers: () => void;
  loadDeniedUsersFromStorage: () => void;
  token: string | null;
  setToken: (token: string | null) => void
  logout: () => void
  chats: Chat[]
  setChats: (chats: Chat[]) => void  
}

export const useUserStore = create<UserStore>((set, get) => {
  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;

  return {
    user: null,
    users: [],
    setUsers: (users: User[]) => set({ users }),
    likedUsers: [],
    requests: [],
    searchResults: [],
    activeChats: [],
    seenUsers: [],
   deniedUsers:[],
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
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentCompany"); 
    set({ user: null, token: null });
  },
    setUser: (userData: User) => {
      console.log("Sätter användare:", userData);
      const userId = userData.id ?? 'temp-user-id';
      const userStorageKey = getUserStorageKey(userId, 'likedUsers');
      const storedLikedUsers = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      const storedChats = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'activeChats')) || '[]');
      const storedRequests = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'requests')) || '[]');
      const storedCredits = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'credits')) || '0');
      const storedPurchasedEmojis = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'purchasedEmojis')) || '[]');
      const storedVIPStatus = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'vipStatus')) || 'false');
      const storedVIPExpiryString = localStorage.getItem(getUserStorageKey(userId, 'vipExpiry'));
      const storedVIPExpiry = storedVIPExpiryString ? Number(storedVIPExpiryString) : null;
      const storedVIPPLUSStatus = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'vipplusStatus')) || 'false');
      const storedVIPPLUSExpiryString = localStorage.getItem(getUserStorageKey(userId, 'vipPlusExpiry'));
      const storedVIPPLUSExpiry = storedVIPExpiryString ? Number(storedVIPPLUSExpiryString) : null;
      const userDeniedKey = getUserStorageKey(userId, 'deniedUsers');
      const storedDeniedUsers = JSON.parse(localStorage.getItem(userDeniedKey) || '[]');
    
      
      set({ 
        user: { 
          ...userData,
          credits: storedCredits || 0,  
          purchasedEmojis: storedPurchasedEmojis || [],
          vipStatus: storedVIPStatus || false,
          vipExpiry: storedVIPExpiry,
          vipPlusExpiry: storedVIPPLUSExpiry,
          vipPlusStatus: storedVIPPLUSStatus
        }, 

        likedUsers: storedLikedUsers, 
        activeChats: storedChats, 
        requests: storedRequests ,
        deniedUsers: storedDeniedUsers,
      });
    },

    // Återställ (rensa) listan med nekade användare
    resetDenyUsers: () => {
      console.log("Återställer nekade användare:", get().deniedUsers);
    
      set({ deniedUsers: [] });
      const userId = get().user?.id ?? 'temp-user-id';
      localStorage.removeItem(getUserStorageKey(userId, 'deniedUsers'));
    
      console.log("Nekade användare återställda och rensade från Zustand/localStorage.");
    },

 
    updateUser: (updatedFields: Partial<User>) => {
      set((state) => {
        if (!state.user) return state;

        const updatedUser = { ...state.user, ...updatedFields };

        // Uppdatera localStorage med nya värden för credits och purchasedEmojis
        const userId = updatedUser.id || '';
        localStorage.setItem(getUserStorageKey(userId, 'credits'), JSON.stringify(updatedUser.credits));
        localStorage.setItem(getUserStorageKey(userId, 'purchasedEmojis'), JSON.stringify(updatedUser.purchasedEmojis));
        localStorage.setItem(getUserStorageKey(userId, 'vipStatus'), JSON.stringify(updatedUser.vipStatus));
        localStorage.setItem(getUserStorageKey(userId, 'vipPlusStatus'), JSON.stringify(updatedUser.vipPlusStatus));
        if (updatedUser.vipExpiry !== undefined && updatedUser.vipExpiry !== null) {
          localStorage.setItem(getUserStorageKey(userId, 'vipExpiry'), updatedUser.vipExpiry.toString());
        }
        if (updatedUser.vipPlusExpiry !== undefined && updatedUser.vipPlusExpiry !== null) {
          localStorage.setItem(getUserStorageKey(userId, 'vipPlusExpiry'), updatedUser.vipPlusExpiry.toString());
        }
        return { user: updatedUser };
      });
    },
    resetUser: () => {
      set({ user: null, likedUsers: [], activeChats: [] });
    },
    // VIP 
    setVIPStatus: (vipStatus: boolean) => {
      set((state) => {
        if (!state.user) return state;

        const updatedUser = { ...state.user, vipStatus };
        const userId = updatedUser.id || '';

        localStorage.setItem(getUserStorageKey(userId, 'vipStatus'), JSON.stringify(updatedUser.vipStatus));

        return { user: updatedUser };
      });
    },
    // VIP + 
    setVIPPLUSStatus: (vipPlusStatus: boolean) => {
      set((state) => {
        if (!state.user) return state;

        const updatedUser = { ...state.user, vipPlusStatus };
        const userId = updatedUser.id || '';
        localStorage.setItem(getUserStorageKey(userId, 'vipPlusStatus'), JSON.stringify(updatedUser.vipPlusStatus));
        return { user: updatedUser };
      });
    },
    addDenyUsers: (user) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const userStorageKey = getUserStorageKey(currentUser.id!, 'deniedUsers');
      
      const updatedDeniedUsers = [...get().deniedUsers, user];
      localStorage.setItem(userStorageKey, JSON.stringify(updatedDeniedUsers));
      
      set({ deniedUsers: updatedDeniedUsers });
      console.log("Uppdaterade nekade användare:", updatedDeniedUsers);
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
      console.log("Accepterar förfrågan från:", senderId);
      set((state) => {
          const userId = state.user?.id || 'temp-user-id';
  
        
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
          const userStorageKey = getUserStorageKey(userId, 'requests');
          localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));
  
          const otherUserStorageKey = getUserStorageKey(senderId, 'requests');
          const otherUserRequestsRaw = localStorage.getItem(otherUserStorageKey);
          const otherUserRequests = otherUserRequestsRaw ? JSON.parse(otherUserRequestsRaw) : [];
  
          const updatedOtherUserRequests = otherUserRequests.map((request: any) => {
              if (
                  request.senderId === userId &&
                  request.receiverId === senderId &&
                  request.status === 'pending'
              ) {
                  return { ...request, status: 'accepted' as 'accepted' };
              }
              return request;
          });
  
          localStorage.setItem(otherUserStorageKey, JSON.stringify(updatedOtherUserRequests));
  
          //chatt om förfrågan accepterades
          const chatRoomId = [userId, senderId].sort().join('-');
          const currentUser = state.user;
          const senderUser = state.likedUsers.find((user) => user.id === senderId);
  
          if (!currentUser || !senderUser) return { requests: updatedRequests };
  
          const newChat: Chat = {
              chatRoomId,
              userIds: [userId, senderId],
              messages: [],
              userNames: [
                  currentUser.firstName || 'Du',
                  senderUser.firstName || 'Användare'
              ],
          };
  
          const firstMessage = "Hej, trevligt att matcha!";
          const newMessage: Message = {
              id: new Date().toISOString(),
              senderId: userId,
              senderName: currentUser.firstName || 'Du',
              message: firstMessage,
              timestamp: new Date().toISOString(),
          };
  
          newChat.messages.push(newMessage);
  
          // chattar för båda användarna
          const updatedChats = [...state.activeChats, newChat];
          localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(updatedChats));
  
          const otherUserChats = JSON.parse(localStorage.getItem(getUserStorageKey(senderId, 'activeChats')) || '[]');
          const updatedOtherUserChats = [...otherUserChats, newChat]; 
          localStorage.setItem(getUserStorageKey(senderId, 'activeChats'), JSON.stringify(updatedOtherUserChats));
  
          return { requests: updatedRequests, activeChats: updatedChats };
      });
  },
  
    loadUserFromStorage: () => {
      const storedUser = localStorage.getItem('user');
      console.log("Hämtad användare från localStorage:", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Kontrollera om VIP har gått ut
        if (parsedUser.vipExpiry && new Date().getTime() > new Date(parsedUser.vipExpiry).getTime()) {
          parsedUser.vipStatus = false;
          parsedUser.vipExpiry = null;
        }
    
        set({ user: parsedUser });
      }
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
      if (!user) {
        console.log("Ingen användare inloggad.");
        return;
      }
    
      const userStorageKey = getUserStorageKey(user.id!, 'requests');
      console.log("Förväntad localStorage-nyckel:", userStorageKey);
    
      const storedRequestsRaw = localStorage.getItem(userStorageKey);
      console.log("Hämtade data från localStorage:", storedRequestsRaw);
    
      if (storedRequestsRaw) {
        const storedRequests = JSON.parse(storedRequestsRaw);
        console.log("Hämtade requests:", storedRequests);
        set({ requests: storedRequests });
      } else {
        console.log("Inga requests hittades.");
        set({ requests: [] });
      }
    
      console.log("State uppdaterad med requests:", get().requests);
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
    
      console.log("Laddade nekade användare från localStorage vid inloggning:", storedDeniedUsers);
    
      set({ deniedUsers: storedDeniedUsers });
    },


    setAllUsers: (users: User[]) => {
      set({ users });
    },

    purchaseEmoji: (emoji: string, price: number) => {
      const currentUser = get().user;
      if (!currentUser) return;
    
      if (currentUser.credits < price) {
        console.log('Inte tillräckligt med krediter!');
        return;
      }
    
      const updatedCredits = currentUser.credits - price;
       // Om emojin inte finns, lägg till den med count 1
      // Kontrollera om emojin redan finns

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

addCredits: (amount: number) => {
  const currentUser = get().user;
  if (!currentUser) return;

  const updatedCredits = currentUser.credits + amount;
  const updatedUser = { ...currentUser, credits: updatedCredits };
  set({ user: updatedUser });

  const userId = updatedUser.id || '';
  localStorage.setItem(getUserStorageKey(userId, 'credits'), JSON.stringify(updatedCredits));
},
 
  };
});
