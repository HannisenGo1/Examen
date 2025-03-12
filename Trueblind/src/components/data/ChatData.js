import { collection, getDocs, getDoc, updateDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useUserStore } from '../../storage/storage';
export const fetchChats = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'chats'));
        const chats = querySnapshot.docs.map((doc) => ({
            chatRoomId: doc.id,
            ...doc.data(),
        }));
        useUserStore.getState().setChats(chats);
    }
    catch (error) {
        console.error('Kunde inte hämta chattar:', error);
    }
};
export const saveChatToFirestore = async (chat) => {
    try {
        const chatRef = doc(db, 'chats', chat.chatRoomId);
        await setDoc(chatRef, {
            userIds: chat.userIds,
            userNames: chat.userNames,
            messages: chat.messages,
        });
    }
    catch (error) {
        console.error('Kunde inte spara chatten:', error);
    }
};
export const addMessageToFirebase = async (chatRoomId, senderId, senderName, message) => {
    try {
        const chatRef = doc(db, 'chats', chatRoomId);
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            const currentMessages = chatData?.messages || [];
            const newMessage = {
                senderId,
                senderName,
                message,
                timestamp: new Date().toISOString(),
            };
            const updatedMessages = [...currentMessages, newMessage];
            await updateDoc(chatRef, {
                messages: updatedMessages,
            });
        }
        else {
            const newChatData = {
                userIds: [senderId, chatRoomId],
                userNames: [senderName, chatRoomId],
                messages: [{
                        senderId,
                        senderName,
                        message,
                        timestamp: new Date().toISOString(),
                    }],
            };
            await setDoc(chatRef, newChatData);
        }
    }
    catch (error) {
        console.error("Fel vid att lägga till meddelande:", error);
    }
};
