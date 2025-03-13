import { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png'
import nalle1 from '../img/imgProdukter/nalle1.png'
import nalle2 from '../img/imgProdukter/nalle2.png'
import heart from '../img/imgProdukter/heart.png'

import { addMessageToFirebase } from './data/ChatData';
import { Message } from '../interface/interfaceUser';
import { doc, onSnapshot} from 'firebase/firestore';
import { db } from './data/firebase';
import { updateEmojiCountInDatabase} from './data/UpdateDatabase';
import VipPlusEmojis from './VipplusEmoji';
import { ReportUser } from './Report';

export const Chat = ()  => {
  const { chatRoomId } = useParams();
  const { activeChats,  user} = useUserStore(); 
  const [errormessage, setErrorMessage]= useState('')
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentChat = activeChats.find((chat) => chat.chatRoomId === chatRoomId);
  const navigate = useNavigate();
  const purchasedEmojis = user?.purchasedEmojis || [];
  const [otherUserName, setOtherUserName] = useState<string>('');
  // @ts-ignore
  const [loading, setLoading] = useState(true);
  const [openReport,setOpenReport] = useState(false)

  // const vipPlusStatus = user?.vipPlusStatus ?? false;
 
 const messagesite = () => { navigate('/messages'); };

 useEffect(() => {
  if (chatRoomId) {
    const chatRef = doc(db, 'chats', chatRoomId);

    const getTheChats = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData?.messages || []);
        
        const currentChat = activeChats.find((chat) => chat.chatRoomId === chatRoomId);
        if (currentChat) {
          const otherUserId = currentChat.userIds.find((id) => id !== user?.id) ?? '';
          const otherUser = currentChat.userNames[currentChat.userIds.indexOf(otherUserId)];
          setOtherUserName(otherUser || 'Okänd användare');
        }
      }
      setLoading(false);
    });

    return () => getTheChats();
  }
}, [chatRoomId, activeChats, user]);

useEffect(() => {
  if (!user) {
    navigate('/');
  }
}, [user, navigate]);
  
  
    useEffect(() => {

  }, [showEmojis]);
  
  {/* skicka meddelande*/ }
  const handleSendMessage = async () => {
    if (newMessage.trim() && chatRoomId && user?.id) {
      
      const newMessageObj: Message = {
        senderId: user.id,
        senderName: user.firstName ?? 'Användare', 
        message: newMessage,
        timestamp: new Date().toISOString(),
        id: '', 
      };
      await addMessageToFirebase(chatRoomId, newMessageObj.senderId, newMessageObj.senderName,
       newMessageObj.message);
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
      await addMessageToFirebase(chatRoomId, newMessageObj.senderId, newMessageObj.senderName, 
        newMessageObj.message);
      setNewMessage(''); 
    }
  };
  
  const handleEmojiClick = async (emojiName: string) => {
    const emojiBaseName = emojiName.split('/').pop()?.split('?')[0].replace('.png', '') || "";
    const emojiItem = purchasedEmojis.find((emoji) => emoji.emoji === emojiBaseName);
  
    if (emojiItem && emojiItem.count > 0) {
      sendEmoji(`<img src="${emojiName}" alt="emoji" class="sent-emoji"/>`);
  
      const updatedEmojis = purchasedEmojis.map((emoji) =>
        emoji.emoji === emojiBaseName
          ? { ...emoji, count: Math.max(emoji.count - 1, 0) }
          : emoji
      );
  
      useUserStore.setState((state) => {
        if (!state.user) {
          console.error("User saknas i state!");
          return state;
        }
        return {
          user: {
            ...state.user,
            purchasedEmojis: updatedEmojis,
          },
        };
      });
  
      try {
        const updatedEmojiItem = updatedEmojis.find((emoji) => emoji.emoji === emojiBaseName);
        if (user && updatedEmojiItem) {
    
          await updateEmojiCountInDatabase(user.id, emojiBaseName, updatedEmojiItem.count);
        } else {
          console.error("Användaren eller emojiItem saknas!");
        }
      } catch (error) {
        console.error("Fel vid uppdatering av emoji count i Firebase:", error);
      }
    } else {
      setErrorMessage("Du har inga kvar av denna emoji.");
    }
  };

if (!user || !user.id) {
  return <p>Laddar...</p>;
}

const emojiClass = (emojiName: string) => {
  return ["nalle1", "nalle2", "bukett"].includes(emojiName) ? "small-emoji" : "";
};

const openTheReport = () => {
  setOpenReport(!openReport);
};

return (
  <>
    <div className="logga">
      <img src={logga} alt="logo" className="img" />
    </div>
    <div className="buttondivforback">
      <button className="btnback" onClick={messagesite}>
        <i className="fas fa-arrow-left"></i>
      </button>
    </div>

    <div className="Rubriktext2-container">
      <h1 className="Rubriktext2">{otherUserName}</h1>
      <p className={`status-inlog ${currentChat?.status?.online ? 'online' : 'offline'}`}></p>
    </div>

    <div className={openReport ? "report-container open" : "report-container"}>
      {!openReport ? (
        <button className="reportbtn" onClick={openTheReport}>Rapportera</button>
      ) : (
        <>
          <button className="closebtn" onClick={openTheReport}>❌</button>
          <ReportUser />
        </>
      )}
    </div>

    {/* Chatten */}
    <div className="chat-container">
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <p>Inga meddelanden än.</p>
        ) : (
          messages.map((msg,) => (
            <div key={msg.id} className={`chat-message ${msg.senderId === user?.id ? 'sent' : 'received'}`}>
              <p className={`status-inlog ${currentChat?.status?.online ? 'online' : 'offline'}`}></p>
              <div className="message-content">
                <p className="sender">{msg.senderId === user?.id ? 'Du' : msg.senderName}</p>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: msg.message }}></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    <div className="chat-message-input-container">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Skriv ditt meddelande..."
      />
      <button className="sendBtn" onClick={handleSendMessage} disabled={!newMessage.trim()}>
        Skicka
      </button>
    </div>

    {/* Emoji Väljare */}
    <div className="rowBtncontainer">
  <button onClick={() => setShowEmojis(!showEmojis)} className="emoji-btn">
    Emojis
  </button>
  <p>{errormessage}</p>

  {showEmojis && (
    <div className="emoji-picker">
      <div className="emoji-list">
        {/* Rendera VIP emojis */}
        <VipPlusEmojis chatRoomId={chatRoomId} sendEmoji={sendEmoji} />

        {/* Rendera köpta emojis */}
        {Array.isArray(user.purchasedEmojis) && user.purchasedEmojis.length > 0 ? (
          user.purchasedEmojis.map((emoji) => {
            let emojiSrc;

            switch (emoji.emoji) {
              case "nalle1":
                emojiSrc = nalle1;
                break;
              case "nalle2":
                emojiSrc = nalle2;
                break;
              case "bukett":
                emojiSrc = bukett;
                break;
              case "heart":
                emojiSrc = heart;
                break;
              default:
                emojiSrc = "";
                break;
            }

            return (
              <button
                key={emoji.emoji}
                onClick={() => handleEmojiClick(emojiSrc)}
                className={`emoji-item ${emojiClass(emoji.emoji)}`}
              >
                <img src={emojiSrc} alt={emoji.emoji} className="emoji-img" />
                <span>{emoji.count}</span>
              </button>
            );
          })
        ) : (
          <p>Du har inga köpta emojis.</p>
        )}
      </div>
    </div>
  )}
</div>
</> 
)} 