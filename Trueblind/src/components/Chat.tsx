import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../storage/storage';

export const Chat = () => {
    const { chatRoomId } = useParams();
    const { activeChats, addMessageToChat, user } = useUserStore();
    const [newMessage, setNewMessage] = useState('');
  
    const currentChat = activeChats.find((chat) => chat.chatRoomId === chatRoomId);
  
    useEffect(() => {
      if (!currentChat) {
        console.log('Chatten finns inte.');
      }
    }, [currentChat]);
  
    if (!currentChat) {
      return <p>Ingen chatthistorik finns än. Vänta på att användaren accepterar din förfrågan.</p>;
    }
  
    const handleSendMessage = () => {
      if (newMessage.trim()) {
        if (chatRoomId) {
          addMessageToChat(chatRoomId, newMessage);
          setNewMessage('');
        }
      }
    };
  
    // För att visa partnerns namn
    const chatPartnerNames = currentChat.userIds
      .filter((id) => id !== user?.id)
      .map((id) => {
        const userChat = activeChats.find((chat) => chat.userIds && chat.userIds.includes(id));
        return userChat ? id : "Unknown User";
      });
  
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chatta med {chatPartnerNames.join(', ')}</h2>
          <h3>Din konversation med {chatPartnerNames.join(', ')}</h3>
        </div>
  
        <div className="chat-messages-container">
          {currentChat.messages.length === 0 ? (
            <p>Inga meddelanden än.</p>
          ) : (
            currentChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
              >
                <div>
                  <p className="sender">{msg.senderId === user?.id ? 'Du' : msg.senderName}</p>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
  
        <div className="chat-message-input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv ditt meddelande..."
          />
          <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Skicka
          </button>
        </div>
      </div>
    );
  };
  