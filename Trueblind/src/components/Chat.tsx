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
import { doc, onSnapshot, updateDoc,getDoc } from 'firebase/firestore';
import { db } from './data/firebase';

export const Chat = ()  => {
    const { chatRoomId } = useParams();
    const { activeChats,  user} = useUserStore(); 
    const [errormessage, setErrorMessage]= useState('')
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [matchResult, setMatchResult] = useState<string | null>(null);
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
    
        return () => 
        getthechats(); 
      }
    }, [chatRoomId]);
    
    useEffect(() => {
      if (quizId) {
        const quizRef = doc(db, 'quiz', quizId);
    
        const unsubscribe = onSnapshot(quizRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const quizData = docSnapshot.data();
            setQuizFinished(quizData.quizFinished || false);
          }
        });
    
        return () => unsubscribe();
      }
    }, [quizId]);

    const messagesite = () => { navigate('/messages'); };
   const isVip = user?.vipPlusStatus;  

   let otherUserName = "Okänd användare";

   if (currentChat && currentChat.userIds && currentChat.userNames && user?.id) {
     const otherUserId = currentChat.userIds.find(id => id !== user.id);
     if (otherUserId) {
       otherUserName = currentChat.userNames[currentChat.userIds.indexOf(otherUserId)];
     }
   }
   
   const joinQuiz = async () => {
    if (!quizId || !user?.id) {
      console.error('QuizId eller userId saknas.');
      return;
    }
  
    try {

      const quizRef = doc(db, 'quiz', quizId);
      await updateDoc(quizRef, {
        user2: user.id,
        user2Answers: {},
      });

      setShowQuiz(true); 
    } catch (error) {
      console.error('Fel vid start av quizet för user2:', error);
    }
  };
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


  
  const handleQuizCompletion = async () => {
    setQuizFinished(true);
  
    // Uppdatera matchresultatet i quizet
    const quizRef = doc(db, 'quiz', quizId!);
    await updateDoc(quizRef, {
      matchResult: 'Ni har 85% matchning!',
    });
  
    setMatchResult('Ni har 85% matchning!');
  if (!user){
    return;
  }

    if (currentChat && currentChat.userIds.length > 1) {
      const user2Id = currentChat.userIds.find(id => id !== user.id); 
      if (user2Id) {
        const message: Message = {
          id: new Date().toISOString(),
          senderId: user.id,  
          senderName: user.firstName || 'Användare',
          timestamp: new Date().toISOString(),
          message: 'Jag har slutfört quizet. Du kan nu delta!',
        };
  
        await addMessageToFirebase(chatRoomId!, user.id, user.firstName || 'Användare', message.message);
      }

    }
  };
  const checkIfUserCanJoinQuiz = () => {
    if (!currentChat) return false;
  if(!user) return false;

    const user2Message = currentChat.messages.some(msg =>
      msg.message.includes("Du kan nu delta!") && msg.senderId !== user.id
    );
  
    return user2Message;

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
{!showQuiz && currentChat?.startedByVipPlus && (
  currentChat?.userIds.length < 2 || (currentChat?.userIds.length === 2 && !quizFinished)
) && (
  <button className="quiz-button" onClick={joinQuiz}>
    Gå med i quizet
  </button>
)}



      {showQuiz ? (
          <div className="quiz-container">
            <button className="close-quiz" onClick={() => setShowQuiz(false)}>X</button>
            <QuizComponent
              userId={user?.id || ''}
              quizId={quizId || ''}
              setQuizId={setQuizId}
              startedByVipPlus={!!isVip}
              onFinish={handleQuizCompletion}
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
      {!isVip && !showQuiz && currentChat?.startedByVipPlus && checkIfUserCanJoinQuiz() && (
  <button 
    className="quiz-button" 
    onClick={joinQuiz}
  >
    Gå med i quizet
  </button>
)}


      
      <div className="chat-message-input-container">
        <textarea value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ditt meddelande..."   />
        <button className='sendBtn' onClick={handleSendMessage} disabled={!newMessage.trim()}>
          Skicka   </button>
 </div>
          <div className="rowBtncontainer"> 
        <button onClick={() => setShowEmojis(!showEmojis)} className="emoji-btn">
          Emojis    </button>
        <p>{errormessage}</p>
      {/* Quiz-knapp */}
      {isVip && !showQuiz && (
        <button className="quiz-button" onClick={() => setShowQuiz(true)}>Starta quizet</button>
      )}
      </div> 
        {/* Emoji-väljare */}
        {showEmojis && (
          <div className="emoji-picker">
            <img src={nalle1} alt="nalle1" className="emoji" onClick={() => handleEmojiClick(nalle1)} />
            <img src={nalle2} alt="nalle2" className="emoji" onClick={() => handleEmojiClick(nalle2)} />
            <img src={bukett} alt="bukett" className="emoji" onClick={() => handleEmojiClick(bukett)} />
            <img src={heart} alt="heart" className="emoji" onClick={() => handleEmojiClick(heart)} />
          </div>
        )}
     
    </>
  );
};