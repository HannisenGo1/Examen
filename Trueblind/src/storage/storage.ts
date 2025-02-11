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
  addMessageToChat: (chatRoomId: string, message: string, senderId: string) => void;
  loadChatsFromStorage: () => void;
  removeMessageFromChat: (chatRoomId: string, messageId: string) => void;

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

      set({ user: userData, likedUsers: storedLikedUsers, activeChats: storedChats });
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
      const senderId = get().user?.id || 'temp-user-id';
      const newRequest: Request = {
        senderId,
        receiverId,
        status: 'pending',
      };

      const userStorageKey = getUserStorageKey(receiverId, 'requests');
      const existingRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      const updatedRequests = [...existingRequests, newRequest];

      localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));
      set({ requests: updatedRequests });
    },

    acceptMessageRequest: (senderId: string) => {
      console.log("Accepterar förfrågan från:", senderId);
      set((state) => {
        const userId = state.user?.id || 'temp-user-id';
        
        // Förfrågan är accepted
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
        
        if (!currentUser || !senderUser) return { requests: updatedRequests };
    
        // Ett nytt chattrum
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
    
        const updatedChats = [...state.activeChats, newChat];
        localStorage.setItem(getUserStorageKey(userId, 'activeChats'), JSON.stringify(updatedChats));
    
        const otherUserId = senderId;
        const otherUserStorageKey = getUserStorageKey(otherUserId, 'activeChats');
        const otherUserChats = JSON.parse(localStorage.getItem(otherUserStorageKey) || '[]');
        const updatedOtherUserChats = [...otherUserChats, newChat]; 
        localStorage.setItem(otherUserStorageKey, JSON.stringify(updatedOtherUserChats));
    
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
      if (user) {
        const userStorageKey = getUserStorageKey(user.id!, 'requests');
        const storedRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        set({ requests: storedRequests });
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
  };
});
