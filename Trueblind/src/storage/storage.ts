import { create } from 'zustand';
import { User, SearchResult, Message,Chat } from '../interface/interfaceUser';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../components/data/firebase';

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
    console.log("Sätter användare:", userData);
    const userId = userData.id ?? 'temp-user-id';
    const userStorageKey = getUserStorageKey(userId, 'likedUsers');
    const storedLikedUsers = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
    const storedChats = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'activeChats')) || '[]');
    const storedRequests = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'requests')) || '[]');
    const userDeniedKey = getUserStorageKey(userId, 'deniedUsers');
    const storedDeniedUsers = JSON.parse(localStorage.getItem(userDeniedKey) || '[]');
  
    set({
      user: userData,
      likedUsers: storedLikedUsers,
      activeChats: storedChats,
      requests: storedRequests,
      deniedUsers: storedDeniedUsers
    });
  },
  purchaseEmoji: (emoji: string, price: number) => {
    const currentUser = get().user;
    if (!currentUser) return;

    if (currentUser.credits < price) {
      console.log('Inte tillräckligt med krediter!');
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
      console.log("Återställer nekade användare:", get().deniedUsers);
    
      set({ deniedUsers: [] });
  
      const userId = get().user?.id ?? 'temp-user-id';
      localStorage.removeItem(getUserStorageKey(userId, 'deniedUsers'));
    
      console.log("Nekade användare återställda och rensade från localStorage.");
  
      const userRef = doc(db, 'users', userId);
    
      try {
        // Tar ut alla nekade användare och tömmer listan i firebase! 
        await updateDoc(userRef, {
          denylist: [] 
        });
    
        console.log('Denylist återställd i Firebase');
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
  
      console.log("Uppdaterade nekade användare:", updatedDeniedUsers);
  
      const userRef = doc(db, 'users', currentUser.id);
  
      try {
        await updateDoc(userRef, {
          denylist: updatedDeniedUsers,
        });
        console.log("Denylist uppdaterad i Firestore");
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
 loadUserFromStorage: () => {
  const storedUser = localStorage.getItem('user')
  if ( storedUser){
    const parsedUser = JSON.parse(storedUser)
  }
 }
  };
});
