import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png'
import nalle1 from '../img/imgProdukter/nalle1.png'
import nalle2 from '../img/imgProdukter/nalle2.png'
export const Chat = () => {
    const { chatRoomId } = useParams();
    const { activeChats, addMessageToChat, removeMessageFromChat, user } = useUserStore(); 
    
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const currentChat = activeChats.find((chat) => chat.chatRoomId === chatRoomId);
    const navigate = useNavigate();
    const messagesite = () => { navigate('/messages'); };

    const otherUserName = currentChat && user?.id 
    ? currentChat.userNames[currentChat.userIds.indexOf(user.id) === 0 ? 1 : 0] 
    : "Okänd användare";
  
  
    useEffect(() => {
      if (!currentChat) {
        console.log('Chatten finns inte.');
      }
    }, [currentChat]);

    if (!currentChat) {
      return <p>Ingen chatthistorik finns än. Vänta på att användaren accepterar din förfrågan.</p>;
    }

    const handleSendMessage = () => {
      if (newMessage.trim() && chatRoomId && user?.id) {
        addMessageToChat(chatRoomId, newMessage, user.id); 
        setNewMessage('');
      } else {
        console.error('Användar-ID saknas eller meddelandet är tomt');
      }
    };

    const handleDeleteMessage = (messageId: string) => {
      const chatRoomId = currentChat?.chatRoomId; 
    
      if (!chatRoomId) {
        console.error('ChatRoomId finns inte!');
        return; 
      }
      removeMessageFromChat(chatRoomId, messageId);
    };
    const sendEmoji = (emojiHtml: string) => {
      if (chatRoomId && user?.id) {
          addMessageToChat(chatRoomId, emojiHtml, user.id);
      }
  };
  
  const handleEmojiClick = (emojiSrc: string) => {
    sendEmoji(`<img src="${emojiSrc}" alt="emoji" class="sent-emoji"/>`);
    setShowEmojis(false);
};

  
    return (
      <> 
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>
      <div className="buttondivforback ">
        <button className="btnback"onClick={messagesite}>
        <i className="fas fa-arrow-left"></i>
          </button>  </div>
            <h1 className='Rubriktext2'> Din chatt med {otherUserName}</h1>      

        <div className="chat-container">
   
        <div className="chat-messages-container">
  {currentChat.messages.length === 0 ? (
    <p>Inga meddelanden än.</p>
  ) : (
    currentChat.messages.map((msg) => (
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

        {msg.senderId === user?.id && (
          <button
            className="delete-message"
            onClick={() => handleDeleteMessage(msg.id)}
          >
            X
          </button>
        )}
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
            <button className='sendBtn' onClick={handleSendMessage} disabled={!newMessage.trim()}>
              Skicka
            </button>
            <button onClick={() => setShowEmojis(!showEmojis)} className="emoji-btn">
                    Emojis
                </button>

                {/* Emoji-väljare */}
                {showEmojis && (
                    <div className="emoji-picker">
        <img src={nalle1} alt="nalle1" className="emoji" onClick={() => handleEmojiClick(nalle1)} />
        <img src={nalle2} alt="nalle2" className="emoji" onClick={() => handleEmojiClick(nalle2)} />
        <img src={bukett} alt="bukett" className="emoji" onClick={() => handleEmojiClick(bukett)} />
                    </div>
                )}
          </div>
       
      </>
    );
};
