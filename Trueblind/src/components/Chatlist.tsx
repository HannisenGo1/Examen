
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage';

export const ChatList = () => {
  const { activeChats } = useUserStore();
  const navigate = useNavigate();

  const handleChatClick = (chatRoomId: string) => {
    navigate(`/chat/${chatRoomId}`); 
  };

  return (
    <div>
      <h2>Alla dina chattar</h2>
      {activeChats.length === 0 ? (
        <p>Du har inga aktiva chattar än.</p>
      ) : (
        activeChats.map((chat) => (
          <div key={chat.chatRoomId} onClick={() => handleChatClick(chat.chatRoomId)}>
            <p>Chatta med: {chat.userIds.join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
};
