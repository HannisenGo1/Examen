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
type Emoji = { emoji:string; count:number}

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
  addMessageToChat: (chatRoomId: string, message: string, senderId: string) => void;
  loadChatsFromStorage: () => void;
  removeMessageFromChat: (chatRoomId: string, messageId: string) => void;
  credits: number;
  purchasedEmojis: Emoji[];
  purchaseEmoji: (emoji: string, cost: number) => void;
  updatePurchasedEmojis: (newEmojis: Emoji[]) => void;
  addCredits: (amount: number) => void;
  useEmoji: (emoji: string) => void;
  loadPurchasedEmojisFromStorage:() => void;
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

    setUser: (userData: User) => {
      const userId = userData.id || '';
      const userStorageKey = getUserStorageKey(userId, 'likedUsers');
      const storedLikedUsers = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      const storedChats = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'activeChats')) || '[]');
      const storedRequests = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'requests')) || '[]');
    
      set({ 
        user: userData, 
        likedUsers: storedLikedUsers, 
        activeChats: storedChats, 
        requests: storedRequests 
      });
    },

    resetUser: () => {
      set({ user: null, likedUsers: [], activeChats: [] });
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
      console.log("Skickar meddelandeförfrågan till:", receiverId);
      set((state) => {
          const senderId = state.user?.id || 'temp-user-id';
  
          // En ny förfrågan
          const newRequest = {
              senderId,
              receiverId,
              status: 'pending',
          };
  
          const senderStorageKey = getUserStorageKey(senderId, 'requests');
          const senderRequestsRaw = localStorage.getItem(senderStorageKey);
          const senderRequests = senderRequestsRaw ? JSON.parse(senderRequestsRaw) : [];
          senderRequests.push(newRequest);
          localStorage.setItem(senderStorageKey, JSON.stringify(senderRequests));
  

          const receiverStorageKey = getUserStorageKey(receiverId, 'requests');
          const receiverRequestsRaw = localStorage.getItem(receiverStorageKey);
          const receiverRequests = receiverRequestsRaw ? JSON.parse(receiverRequestsRaw) : [];
          receiverRequests.push(newRequest);
          localStorage.setItem(receiverStorageKey, JSON.stringify(receiverRequests));
  
          return { requests: senderRequests };
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
  
    addMessageToChat: (chatRoomId: string, message: string, senderId: string) => {
      set((state) => {
        const chat = state.activeChats.find((chat) => chat.chatRoomId === chatRoomId);
    
        if (!chat) {
          console.error('Chattrum ej hittad:', chatRoomId);
          return state; 
        }
    
        const newMessage: Message = {
          id: new Date().toISOString(), 
          senderId,
          senderName: state.user?.firstName || 'Användare', 
          message,
          timestamp: new Date().toISOString(),
        };
    
        const updatedMessages = [...chat.messages, newMessage];
        const updatedChats = state.activeChats.map((chat) =>
          chat.chatRoomId === chatRoomId ? { ...chat, messages: updatedMessages } : chat
        );
    
        localStorage.setItem(getUserStorageKey(senderId, 'activeChats'), JSON.stringify(updatedChats));
    
        const otherUserId = chat.userIds.find((id) => id !== senderId);
        if (otherUserId) {
          const otherUserStorageKey = getUserStorageKey(otherUserId, 'activeChats');
          const otherUserChats = JSON.parse(localStorage.getItem(otherUserStorageKey) || '[]');
          const updatedOtherUserChats = otherUserChats.map((chat: Chat) =>
            chat.chatRoomId === chatRoomId ? { ...chat, messages: updatedMessages } : chat
          );
          localStorage.setItem(otherUserStorageKey, JSON.stringify(updatedOtherUserChats));
        }
    
        localStorage.setItem(getUserStorageKey(senderId, 'activeChats'), JSON.stringify(updatedChats));
        return { activeChats: updatedChats };
      });
    },
    removeMessageFromChat: (chatRoomId: string, messageId: string) => {
      set((state) => {

        const chat = state.activeChats.find((chat) => chat.chatRoomId === chatRoomId);
        
        if (!chat) {
          console.error('Chatten finns inte:', chatRoomId);
          return state; 
        }

        const updatedMessages = chat.messages.filter((msg) => msg.id !== messageId);

        const updatedChats = state.activeChats.map((chat) =>
          chat.chatRoomId === chatRoomId ? { ...chat, messages: updatedMessages } : chat
        );
        localStorage.setItem(getUserStorageKey(state.user?.id!, 'activeChats'), JSON.stringify(updatedChats));
    
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
      if (!user) {
        console.log("Ingen användare inloggad.");
        return;
      }
    
      const userStorageKey = getUserStorageKey(user.id!, 'requests');
      console.log("Förväntad localStorage-nyckel:", userStorageKey);
    
      const storedRequestsRaw = localStorage.getItem(userStorageKey);
      console.log("Hämtade data från localStorage:", storedRequestsRaw);
    
      const storedRequests = storedRequestsRaw ? JSON.parse(storedRequestsRaw) : [];
      set({ requests: storedRequests });
    
      console.log("State uppdaterad med requests:", storedRequests);
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

    clearUserData: () => {
      const user = get().user;
      if (user) {
        const userStorageKey = getUserStorageKey(user.id!, 'likedUsers');
        localStorage.removeItem(userStorageKey);
        const requestStorageKey = getUserStorageKey(user.id!, 'requests');
        localStorage.removeItem(requestStorageKey);
      }
    },

    setAllUsers: (users: User[]) => {
      set({ users });
    },

    /* Emoji storen */
    credits: 0,
    purchasedEmojis: [],
    purchaseEmoji: (emoji, cost) => set((state) => {
      if (state.credits >= cost) {
        const existingEmoji = state.purchasedEmojis.find(e => e.emoji === emoji);
        let updatedEmojis = [...state.purchasedEmojis]; 
    
        if (existingEmoji) {
          const index = updatedEmojis.findIndex(e => e.emoji === emoji);
          updatedEmojis[index].count += 1;
        } else {

          updatedEmojis.push({ emoji, count: 1 });
        }
        return { purchasedEmojis: updatedEmojis, credits: state.credits - cost };
      } else {
        console.log('Not enough credits!');
        return state;
      }
    }),
    updatePurchasedEmojis: (newEmojis: Emoji[]) => set({ purchasedEmojis: newEmojis }),

    
    addCredits: (amount) => set((state) => ({
      credits: state.credits + amount
    })),
    useEmoji: (emojiSrc: string) => {
      set((state) => {
        const updatedEmojis = state.purchasedEmojis.map((emoji) =>
          emoji.emoji === emojiSrc ? { ...emoji, count: emoji.count - 1 } : emoji
        );
        localStorage.setItem('purchasedEmojis', JSON.stringify(updatedEmojis)); // Uppdatera localStorage
        return { purchasedEmojis: updatedEmojis };
      });
    },
    loadPurchasedEmojisFromStorage: () => {
      const emojis = JSON.parse(localStorage.getItem('purchasedEmojis') || '[]');
      set({ purchasedEmojis: emojis });
     
    }

  };
});
