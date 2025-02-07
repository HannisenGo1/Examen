import logga from '../img/logga.png';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import { useEffect } from 'react';

export const Messages = () => {
  const { requests, likedUsers, acceptMessageRequest, removeLikedUser, activeChats } = useUserStore();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const backsite = () => {
    navigate('/account');
  };

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      console.log("No user available.");
      return;
    }
  
    const userStorageKey = `${userId}-requests`;
    const storedRequests = localStorage.getItem(userStorageKey);
    
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      const uniqueRequests = Array.from(new Set(parsedRequests.map((req: any) => req.senderId)))
        .map((senderId) => parsedRequests.find((req: any) => req.senderId === senderId));
      console.log('Unika förfrågningar:', uniqueRequests);
    } else {
      console.log("No requests found in localStorage");
    }
  }, [user]);


  const handleAccept = (senderId: string) => {
    if (!user) {
      console.log("Användare inte inloggad.");
      return;
    }

    const userId = user.id;
    acceptMessageRequest(senderId); 

    const chatRoomId = [userId, senderId].sort().join('-');
    console.log("ChatRoomId:", chatRoomId);

    // Uppdatera requests för båda användare
    const updatedRequests = requests.map((request) => {
      if (request.senderId === senderId || request.receiverId === senderId) {
        return { ...request, status: 'accepted' };
      }
      return request;
    });

    const userStorageKey = `${userId}-requests`;
    localStorage.setItem(userStorageKey, JSON.stringify(updatedRequests));

    // Uppdatera chattar
    const updatedChats = [...activeChats];
    localStorage.setItem(`${userId}-activeChats`, JSON.stringify(updatedChats));


    navigate(`/chat/${chatRoomId}`);
  };

  const handleReject = (senderId: string) => {
    removeLikedUser(senderId);

    const updatedRequests = requests.filter(request => request.senderId !== senderId);

    const userId = user?.id || '';
    const userStorageKey = `${userId}-requests`;

    // Uppdatera requests i localStorage
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
              <div key={`${request.senderId}-${index}`}>
                <p>{sender.firstName} vill chatta med dig!</p>
                <p>Status: {request.status}</p>
                {request.status === 'pending' && (
                  <div>
                    <button onClick={() => handleAccept(request.senderId)}>Acceptera</button>
                    <button onClick={() => handleReject(request.senderId)}>Neka</button>
                  </div>
                )}
              </div>
            );
          })
        )}
  

        <div>
          <h2>Aktiva Chattar</h2>
          {activeChats.length === 0 ? (
            <p>Du har inga aktiva chattar.</p>
          ) : (
            activeChats.map((chat) => {
           
              const userNames = chat.userNames || [];
              return (
                <div key={chat.chatRoomId}>
                  <button onClick={() => navigate(`/chat/${chat.chatRoomId}`)}>
                    Chatta med {userNames.join(', ')}
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
