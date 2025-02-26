import { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png'
import nalle1 from '../img/imgProdukter/nalle1.png'
import nalle2 from '../img/imgProdukter/nalle2.png'
import heart from '../img/imgProdukter/heart.png'
import { QuizComponent } from './games/quiz';
import { addMessageToFirebase } from './data/ChatData';
import { Message } from '../interface/interfaceUser';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './data/firebase';

export const Chat = ()  => {
    const { chatRoomId } = useParams();
    const { activeChats,  user} = useUserStore(); 
    const [errormessage, setErrorMessage]= useState('')
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizId, setQuizId] = useState<string | null>(null); 
    const [messages, setMessages] = useState<Message[]>([]);
    const currentChat = activeChats.find((chat) => chat.chatRoomId === chatRoomId);
    const navigate = useNavigate();

    useEffect(() => {
      if (chatRoomId) {
        const chatRef = doc(db, 'chats', chatRoomId);
    
    
        const getthechats = onSnapshot(chatRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const chatData = docSnapshot.data();
            const updatedMessages = chatData?.messages || [];
    
            setMessages(updatedMessages); 
          }
        });
    
        return () => getthechats(); 
      }
    }, [chatRoomId]);


    const messagesite = () => { navigate('/messages'); };
   const isVip = user?.vipPlusStatus;  

   let otherUserName = "Okänd användare";

   if (currentChat && currentChat.userIds && currentChat.userNames && user?.id) {
     const otherUserId = currentChat.userIds.find(id => id !== user.id);
     if (otherUserId) {
       otherUserName = currentChat.userNames[currentChat.userIds.indexOf(otherUserId)];
     }
   }


    const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;
   
  
    useEffect(() => {
      if (!user) {
        navigate('/');
      }
    }, [user, navigate]);
 
    useEffect(() => {
      const purchasedEmojis = useUserStore.getState().user?.purchasedEmojis || [];

    }, [user?.purchasedEmojis]);

    useEffect(() => {
      if (!currentChat) {
        console.log('Chatten finns inte.');
      }
    }, [currentChat]);

    if (!currentChat) {
      return <p>Ingen chatthistorik finns än. Vänta på att användaren accepterar din förfrågan.</p>;
    }
{/* Hanteringen av Quizet */ }
  useEffect(() => {
    if (currentChat?.quizId) {
      setQuizId(currentChat.quizId); 
    }
  }, [currentChat]);

   const startQuiz = (id: string) => {
    setQuizId(id);
    setShowQuiz(true);
  };

  {/* Hanteringen av meddelande*/ }
  const handleSendMessage = async () => {
    if (newMessage.trim() && chatRoomId && user?.id) {

      const newMessageObj: Message = {
        senderId: user.id,
        senderName: user.firstName ?? 'Användare', 
        message: newMessage,
        timestamp: new Date().toISOString(),
        id: '', 
      };
  
      await addMessageToFirebase(chatRoomId, newMessageObj.senderId, newMessageObj.senderName, newMessageObj.message);
      setNewMessage('');
    } 
  };
  

    const sendEmoji = async (emojiHtml: string) => {
      if (chatRoomId && user?.id) {
        const newMessageObj: Message = {
          senderId: user.id,
          senderName: user.firstName || 'Användare',
          message: emojiHtml, 
          timestamp: new Date().toISOString(),
          id: '', 
        };
        await addMessageToFirebase(chatRoomId, newMessageObj.senderId, newMessageObj.senderName, newMessageObj.message);

        setNewMessage(''); 
      }
    };

  const handleEmojiClick = (emojiName: string) => {
    const emojiBaseName = emojiName.split('/').pop()?.split('?')[0].replace('.png', '') || ""; 
    const currentUser = useUserStore.getState().user;
  
    if (!currentUser) {
      console.error("Ingen användare inloggad!");
      return;
    }
  
    const emojiItem = currentUser.purchasedEmojis.find((emoji) => emoji.emoji === emojiBaseName);
    if (emojiItem) {
      console.log("Emoji hittad:", emojiItem);
  
      if (emojiItem.count > 0) {
        const updatedEmojis = currentUser.purchasedEmojis
          .map((e) => e.emoji === emojiBaseName ? { ...e, count: e.count - 1 } : e)
          .filter(e => e.count > 0); 
  
        const userId = currentUser.id || '';
        localStorage.setItem(getUserStorageKey(userId, 'purchasedEmojis'), JSON.stringify(updatedEmojis));

        const updatedUser = { ...currentUser, purchasedEmojis: updatedEmojis };
        useUserStore.getState().setUser(updatedUser);
  
        setTimeout(() => {
          sendEmoji(`<img src="${emojiName}" alt="emoji" class="sent-emoji"/>`);
          setShowEmojis(false);
        }, 50);
      } else {
        console.log("Du har inga kvar av denna emoji.");
      }
    } else {
      setErrorMessage("Emoji inte hittad i purchasedEmojis.");
    }
  };

  return (
    <>
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>
      <div className="buttondivforback ">
        <button className="btnback" onClick={messagesite}>
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
      <h1 className='Rubriktext2'>Din chatt med {otherUserName}</h1>

      {/* Chatten */}
      <div className="chat-container">
      {showQuiz ? (
          <div className="quiz-container">
            <button className="close-quiz" onClick={() => setShowQuiz(false)}>X</button>
            <QuizComponent
              userId={user?.id || ''}
              quizId={quizId || ''}
              setQuizId={setQuizId}
              vipPlusStatus={!!isVip}
            />
          </div>

        ) : (
          <div className="chat-messages-container">
{messages.length === 0 ? (
  <p>Inga meddelanden än.</p>
) : (
  messages.map((msg) => (
    <div
      key={msg.id}
      className={`chat-message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
    >
      <div className="message-content">
        <p className="sender">
          {msg.senderId === user?.id ? 'Du' : msg.senderName}
        </p>
        <p className="message-text" dangerouslySetInnerHTML={{ __html: msg.message }}></p>
      </div>

    </div>
  ))
)}
          </div>
        )}
      </div>
      {/* Quiz-knapp */}
      {isVip && !showQuiz && (
        <button className="quiz-button" onClick={() => setShowQuiz(true)}>Starta quizet</button>
      )}
   {!isVip && !showQuiz && (
        <button className="quiz-button" onClick={() => setShowQuiz(true)}>Delta i quizet</button>
      )}
      
      <div className="chat-message-input-container">
        <textarea value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ditt meddelande..."   />
        <button className='sendBtn' onClick={handleSendMessage} disabled={!newMessage.trim()}>
          Skicka   </button>
        <button onClick={() => setShowEmojis(!showEmojis)} className="emoji-btn">
          Emojis    </button>
        <p>{errormessage}</p>

        {/* Emoji-väljare */}
        {showEmojis && (
          <div className="emoji-picker">
            <img src={nalle1} alt="nalle1" className="emoji" onClick={() => handleEmojiClick(nalle1)} />
            <img src={nalle2} alt="nalle2" className="emoji" onClick={() => handleEmojiClick(nalle2)} />
            <img src={bukett} alt="bukett" className="emoji" onClick={() => handleEmojiClick(bukett)} />
            <img src={heart} alt="heart" className="emoji" onClick={() => handleEmojiClick(heart)} />
          </div>
        )}
      </div>
    </>
  );
};