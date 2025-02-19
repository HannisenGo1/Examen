import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import { User } from '../interface/interfaceUser';
import {isVIPExpired}  from './VipUser'

export const FindPartners = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchingResults, setMatchingResults] = useState<User[]>([]);
  const [city, setCity] = useState('');
  const [religion, setReligion] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
const [currentUser,setCurrentUser]= useState(0)
  const [nekadUser, setNekadUser] = useState<User[]>([]);
  const { user, likedUsers, addLikedUser,
    deniedUsers, resetDenyUsers,addDenyUsers 
   } = useUserStore();
  const userId = useUserStore((state) => state.user?.id);
  const isVip = user?.vipStatus; 
  
  if (!user) {
    return <p>Du måste vara inloggad för att söka efter partners.</p>;
  }

  const { gender: yourGender, sexualOrientation: yourSexualOrientation, id: yourId } = user;

  const seenUsersKey = `seenUsers-${user.id}`;

  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;

  
  
  const filterNewUsers = (filteredUsers: User[]) => {
    return filteredUsers.filter((user) => 
      user.id &&
      !likedUsers.some(likedUser => likedUser.id === user.id) &&
      !deniedUsers.some(deniedUser => deniedUser.id === user.id)
    );
  };
  



// användaren ska inte se samma lista mer än en gång, och endast få
// ut nya users och inte det som man har gjort ett val på.
const fetchUsers = async (userId: string) => {
  setLoading(true);
  
  if (!userId) {
    console.error("No user ID found");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users');
    if (!response.ok) throw new Error('Något gick fel vid hämtning av användare');

    const data = await response.json();
    
    const savedSeenUsers = JSON.parse(localStorage.getItem(seenUsersKey) || '[]');

    const filteredUsers = data.filter((user: User) => 
      user.id &&
      !savedSeenUsers.includes(user.id) &&
      !likedUsers.some(likedUser => likedUser.id === user.id) &&
      !nekadUser.some(deniedUser => deniedUser.id === user.id)
    );

    setUsers(filteredUsers);
  } catch (err) {
    setError('Fel vid hämtning av användare');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (userId) {
      fetchUsers(userId);
    }
  }, [userId]);
  

  const calculateMatch = (likedUser: User) => {
    if (!user) return 0;
    let matchScore = 0;
    const totalCriteria = 7;
    if ((user.interests || "") === (likedUser.interests || "")) matchScore++;
    if (user.smokes === likedUser.smokes) matchScore++;
    if (user.religion === likedUser.religion) matchScore++;
    if (user.wantsChildren === likedUser.wantsChildren) matchScore++;
    if (user.hasChildren === likedUser.hasChildren) matchScore++;
    if (user.education === likedUser.education) matchScore++;
    if (user.relationshipStatus === likedUser.relationshipStatus) matchScore++;
    const matchPercentage = (matchScore / totalCriteria) * 100;
    return Math.round(matchPercentage);
  };

  const filterUsers = () => {
    const normalizedSexualOrientation = yourSexualOrientation;

    const filteredUsers = users.filter((user: User) => {
      if (user.id === yourId) {
        return false;
      }
      const isCityMatch = city ? user.city === city : true;
      const isReligionMatch = religion ? user.religion === religion : true;
      const isNotDenied = !nekadUser.some((deniedUser) => deniedUser.id === user.id);
      let isGenderMatch = false;
      const userSexualOrientation = user.sexualOrientation;
      const yourGenderLower = yourGender;
      const userGenderLower = user.gender;

      if (normalizedSexualOrientation === 'Hetero') {
        if (yourGenderLower === 'Man' && userGenderLower === 'Kvinna') {
          if (userSexualOrientation === 'Hetero') {
            isGenderMatch = true;
          }
        } else if (yourGenderLower === 'Kvinna' && userGenderLower === 'Man') {
          if (userSexualOrientation === 'Hetero') {
            isGenderMatch = true;
          }
        }
      } else if (normalizedSexualOrientation === 'Bi') {
        if (userSexualOrientation === 'Bi') {
          isGenderMatch = true;
        }
      } else if (normalizedSexualOrientation === 'Homo') {
        if (yourGenderLower === userGenderLower && userSexualOrientation === 'Homo') {
          isGenderMatch = true;
        }
      }

      return isCityMatch && isGenderMatch && isReligionMatch && isNotDenied;;
      
    });

    const newUsers = filterNewUsers(filteredUsers);
    setMatchingResults(filteredUsers);
    setCurrentUser(0); 
  };

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinAge(parseInt(e.target.value, 10));
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAge(parseInt(e.target.value, 10));
  };

// Lägg till användaren i gillalistan <3
// Rensa bort gillade användaren från fetch-listan
const handleLike = (userId: string) => {
  const likedUser = matchingResults.find((user) => user.id === userId);
  if (likedUser) {
    addLikedUser(likedUser);
    console.log('likedUser', likedUser)

    setMatchingResults((prev) => prev.filter((user) => user.id !== likedUser.id)); 
    nextUser();
  }
};

  
// lägg till användaren i neka listan X 
// Ta bort nekad användare från fetch-listan
const handleDeny = (userId: string) => {
  const deniedUser = matchingResults.find((user) => user.id === userId);
  if (deniedUser) {
    addDenyUsers(deniedUser);
    console.log('deniedUser', deniedUser);

    const updatedDeniedUsers = [...deniedUsers, deniedUser];
    localStorage.setItem(getUserStorageKey(user?.id ?? "temp-user-id", "deniedUsers"), JSON.stringify(updatedDeniedUsers));

    setMatchingResults((prev) => prev.filter((user) => user.id !== userId)); 
    nextUser();
  }
};

const nextUser = () => {
  if (matchingResults.length > 1) {
    setCurrentUser((prevUser) => (prevUser + 1) % matchingResults.length);
  } else {
    setCurrentUser(0); 
  }
};


const showCurrentUser = matchingResults[currentUser];
const [loadedDeniedUsers, setLoadedDeniedUsers] = useState<User[]>([]);

useEffect(() => {
  const storedDenied = JSON.parse(
    localStorage.getItem(getUserStorageKey(user?.id ?? "temp-user-id", "deniedUsers")) || "[]"
  );

  console.log("Laddade nekade användare:", storedDenied); 

  setLoadedDeniedUsers(storedDenied);
}, [user?.id]);

// Återställ nekade användare om man är VIP
const restoreDeniedUsers = () => {
  if (!isVip || loadedDeniedUsers.length === 0) return;

  console.log("Återställer nekade användare:", loadedDeniedUsers); 

  setMatchingResults((prevState) => [...loadedDeniedUsers, ...prevState]);

  setTimeout(() => {
    resetDenyUsers(); 
    console.log("Nekade användare återställda och rensade från Zustand/localStorage.");
    setLoadedDeniedUsers([]); 
  }, 100);
};

  return (
    <div className="columndiv3">
      <h2>Hitta en partner</h2>
 <label htmlFor="minAge">Ålder mellan:</label>
      <div className="age-filter-container">

        <input
          type="number"
          id="minAge"
          value={minAge}
          onChange={handleMinAgeChange}
          min="0"
          max="120"
        />

        <input
          type="number"
          id="maxAge"
          value={maxAge}
          onChange={handleMaxAgeChange}
          min="0"
          max="120"
        />
      </div>

      <div className="search-form">
        <label htmlFor="city">Stad:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Exempel: Stockholm"
          className="input-field"
        />
        <button onClick={filterUsers} disabled={loading} className="search-button">
          {loading ? 'Laddar...' : 'Sök partners'}
        </button>

<button 
  onClick={restoreDeniedUsers} 
  disabled={!isVip} 
  className={`btn ${isVip ? 'btn-primary' : 'btn-disabled'}`}
>
  Återställ nekade användare
</button>

      </div>

      {matchingResults.length > 0 && showCurrentUser ? (
  <div className="results-item">
    <ul className="results-list">
      <li key={showCurrentUser.id} className="result-item">
        <div className="result-info">
          <h4>{showCurrentUser.firstName} <span className="age">, {showCurrentUser.age}</span></h4>
          <p><strong>Matchar: {calculateMatch(showCurrentUser)}%</strong> </p>
          <p><strong>Kön:</strong> {showCurrentUser.gender}</p>
          <p><strong>Religion:</strong> {showCurrentUser.religion}</p>
          <p><strong>Läggning:</strong> {showCurrentUser.sexualOrientation}</p>
        </div>
        <div className="life-statements">
          <p>{showCurrentUser.lifeStatement1}</p>
          <p>{showCurrentUser.lifeStatement2}</p>
          {isVip && (
                  <>
                    <p><strong>Intressen:</strong> {showCurrentUser.interests?.join(', ')}</p>
                    <p><strong>Har barn:</strong> {showCurrentUser.hasChildren ? 'Ja' : 'Nej'}</p>
                    <p><strong>Vill ha barn:</strong> {showCurrentUser.wantsChildren ? 'Ja' : 'Nej'}</p>
                    <p><strong>Röker:</strong> {showCurrentUser.smokes}</p>
                    <p><strong>Relationsstatus:</strong> {showCurrentUser.relationshipStatus}</p>
                    <p><strong>Utbildning:</strong> {showCurrentUser.education}</p>
                    <p><strong>Favoritsång:</strong> {showCurrentUser.favoriteSong}</p>
                    <p><strong>Favoritfilm:</strong> {showCurrentUser.favoriteMovie}</p>
                  </>
                )}
          <div className="button-container">
            <button onClick={() => handleDeny(showCurrentUser.id!)} className="deny-button">❌</button>
            <button onClick={() => handleLike(showCurrentUser.id!)} className="like-button">❤️</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
) : (
  <p className="no-results">Inga matchande resultat</p>
  
)}
         {error && <p className="error-message">{error}</p>}
      </div>

  );
};


