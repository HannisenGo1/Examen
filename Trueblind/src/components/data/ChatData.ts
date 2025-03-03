import { collection, getDocs,getDoc,updateDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; 
import { useUserStore } from '../../storage/storage';
import { Chat} from '../../interface/interfaceUser';  

export const fetchChats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'chats'));
    
    const chats: Chat[] = querySnapshot.docs.map((doc) => ({
      chatRoomId: doc.id,
      ...doc.data(),
    })) as Chat[];  


    useUserStore.getState().setChats(chats);  

    console.log('Hämtade chattar från Firestore:', chats);
  } catch (error) {
    console.error('Kunde inte hämta chattar:', error);
  }
};
export const saveChatToFirestore = async (chat: Chat) => {
    try {
      
      const chatRef = doc(db, 'chats', chat.chatRoomId);
  
      await setDoc(chatRef, {
        userIds: chat.userIds,
        userNames: chat.userNames,
        messages: chat.messages,
        quizId: chat.quizId || null,
      });
  
      console.log('Chatten har sparats i Firestore:', chat);
    } catch (error) {
      console.error('Kunde inte spara chatten:', error);
    }
  };
  export const addMessageToFirebase = async (chatRoomId: string, senderId: string, senderName: string, message: string) => {
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
    
        console.log("Meddelande tillagt!");
      } else {

        const newChatData = {
          userIds: [senderId, chatRoomId], 
          userNames: [senderName, chatRoomId], 
          messages: [{
            senderId,
            senderName,
            message,
            timestamp: new Date().toISOString(),
          }],
          quizId: null, 
        };
    
        await setDoc(chatRef, newChatData);
    
        console.log("Ny chatt skapad och meddelande tillagt!");
      }
    } catch (error) {
      console.error("Fel vid att lägga till meddelande:", error);
    }
  };


  
  //  hämta chat-id från quiz-id
 export const getChatIdFromQuizId = async (quizId: string): Promise<string | null> => {
    try {
      const quizRef = doc(db, "quiz", quizId); 
      const quizSnap = await getDoc(quizRef); 
  
      if (quizSnap.exists()) {
        const quizData = quizSnap.data();
   
        return quizData.chatId || null;
      } else {
        console.log("Quizet finns inte");
        return null;
      }
    } catch (error) {
      console.error("Fel vid hämtning av chatId från quiz:", error);
      return null;
    }
  };
  