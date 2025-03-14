import logga from '../img/logga.png';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { doc, setDoc } from 'firebase/firestore';
import { db } from './data/firebase';

export const Messages = () => {
  const { requests, likedUsers, acceptMessageRequest, removeLikedUser, activeChats,setChats } = useUserStore();
  const navigate = useNavigate();
  const { user } = useUserStore();
  // @ts-ignore
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const backsite = () => {
    navigate('/account');
  };

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      return;
    }

    const userStorageKey = `${userId}-requests`;
    const storedRequests = JSON.parse(localStorage.getItem(userStorageKey) || '[]');

    const uniqueRequests = Array.from(new Set(storedRequests.map((req: any) => req.senderId)))
      .map((senderId) => storedRequests.find((req: any) => req.senderId === senderId));

    setFilteredRequests(uniqueRequests);
  }, [user]);


  const handleAccept = async (senderId: string) => {
    if (!user) {
      return;
    }
    const userId = user.id;
    acceptMessageRequest(senderId);
    const chatRoomId = uuidv4();
  
    // Kolla om chat redan finns
    const existingChat = activeChats.find(
      (chat) =>
        chat.userIds.includes(userId) && chat.userIds.includes(senderId)
    );
    
    if (existingChat) {
      console.log("Chatt mellan användarna existerar redan.");
      navigate(`/chat/${existingChat.chatRoomId}`);
      return;
    }
  
    // Skapa en ny chatt om den inte finns
    const newChat = {
      chatRoomId,
      userIds: [userId, senderId],
      messages: [],
      userNames: [user.firstName, likedUsers.find((user) => user.id === senderId)?.firstName || "Okänd"],
  };

  await setDoc(doc(db, "chats", chatRoomId), newChat); 

  setChats([...activeChats, newChat]);
  localStorage.setItem(`${userId}-activeChats`, JSON.stringify([...activeChats, newChat]));

  navigate(`/chat/${chatRoomId}`);
};
  

  const handleReject = (senderId: string) => {
    removeLikedUser(senderId);

    const updatedRequests = requests.filter(request => request.senderId !== senderId);

    const userId = user?.id || '';
    const userStorageKey = `${userId}-requests`;
    localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));
  };

  return (
    <>
      <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>
      <div className="buttondivforback">
        <button onClick={backsite} className="btnback">
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
  
      <div className="columndiv2">
        
        <p> Meddelande förfrågningar </p>
    {(requests && requests.length === 0) ? (
      
          <p>Inga nya meddelanden.</p>
        ) : (
          requests && requests.filter(request => request.status === 'pending').map((request, index) => {
            const sender = likedUsers && likedUsers.find(user => user.id === request.senderId);
            if (!sender) return null;
  
            return (
              <div className="columndiv2" key={`${request.senderId}-${index}`}>
                <p>{sender.firstName} vill chatta med dig!</p>
               
                {request.status === 'pending' && (
                  <div >
                    <button onClick={() => handleAccept(request.senderId)}>Acceptera</button>
                    <button onClick={() => handleReject(request.senderId)}>Neka</button>
                  </div>
                )}
              </div>
            );
          })
        )}
  
        <div className="columndiv2">
          <h2>Dina Chattar</h2>
          {activeChats.length === 0 ? (
            <p>Du har inga aktiva chattar.</p>
          ) : (
            activeChats.map((chat) => {
              const userNames = chat.userNames?.filter(name => name !== user?.firstName) || [];
              return (
                <div className="divForallChats" key={chat.chatRoomId}>
                  <button className="ToChatBtn" onClick={() => navigate(`/chat/${chat.chatRoomId}`)}>
                    {userNames.join(', ')}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
  
};
