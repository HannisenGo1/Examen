import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import { User } from '../interface/interfaceUser';
import { fetchUsers } from './data/GetUserData';
import {doc, updateDoc} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import viplogga from '../img/viplogga.png'
import viploggaplus from '../img/viplogga+.png'


export const FindPartners = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchingResults, setMatchingResults] = useState<User[]>([]);
  const [city, setCity] = useState('');
  const [religion] = useState('');
  const [error, setError] = useState<string>('');
  const [loading] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const [currentUser,setCurrentUser]= useState(0)
  const [nekadUser] = useState<User[]>([]);
  const { user, likedUsers, addLikedUser, deniedUsers, resetDenyUsers,addDenyUsers } = useUserStore();
  const [message, setMessage] = useState('')

// storage key för användarens id.
const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;
const db = getFirestore();


  const isVip = (user: User | undefined) => {
    return user?.vipStatus || user?.vipPlusStatus || false;   }

// eftersom typescript klagade på user is undefined. 
  if (!user) {
return<p>Du måste vara inloggad för att söka efter partners</p> }
  

  const { gender: yourGender, sexualOrientation: yourSexualOrientation, id: yourId } = user;

  
  const filterLikedAndDeniedUsers = (users: User[], likedUsers: User[], deniedUsers: User[]): User[] => {
    return users.filter(user => 
      !likedUsers.some(likedUser => likedUser.id === user.id) && 
      !deniedUsers.some(deniedUser => deniedUser.id === user.id)
    );

  };

  // hämtning av gillade och nekade användare från storage.
  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
      const storedUsers = useUserStore.getState().users; 

      if (storedUsers && storedUsers.length > 0) {
        const filteredUsers = filterLikedAndDeniedUsers(storedUsers, likedUsers, deniedUsers);
        setUsers(filteredUsers);
      } else {
        console.error('Ingen användardata tillgänglig!');
        setError('Kunde inte ladda användardata.');
      }
    };
    loadUsers();
  }, [likedUsers, deniedUsers]);
  
// calculering utav användarnas egenskaper för matchning. 
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
    if (!users || users.length === 0) {
      return;
    }
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
      setMessage('Gillad användare tillagd i gilla på din kontosida')
      
      setTimeout(() => {
        setMessage('')
      },2000)
      
      setMatchingResults((prev) => prev.filter((user) => user.id !== likedUser.id)); 
      nextUser();
    }
  };

  const handleDeny = async (userId: string) => {
    const deniedUser = matchingResults.find((user) => user.id === userId);
  
    if (deniedUser) {
      await addDenyUsers(deniedUser);
  
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

  const calculateAge = (year: number, month: number, day: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
  
    if (
      today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--; 
    }
  
    return age;
  };

  const showCurrentUser = matchingResults[currentUser];
  const [loadedDeniedUsers, setLoadedDeniedUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const storedDenied = JSON.parse(
      localStorage.getItem(getUserStorageKey(user?.id ?? "temp-user-id", "deniedUsers")) || "[]"
    );
    
    setLoadedDeniedUsers(storedDenied);
  }, [user?.id]);
  
  // Återställ nekade användare om man är VIP
  // Fetcha ut ifrån databasen.
 
  const restoreDeniedUsers = async () => {  
    if (!isVip(user)) {
      return;
    }
  
    resetDenyUsers();
    setMatchingResults((prevState) => [...loadedDeniedUsers, ...prevState]);
  
    const userRef = doc(db, 'users', user.id);
  

    const updatedDenylist = user.denylist ? 
      user.denylist.filter((deniedUser) => !loadedDeniedUsers.some((u) => u.id === deniedUser.id)) :
      [];
  
    try {
      await updateDoc(userRef, {
        denylist: updatedDenylist, 
      });
  
      setLoadedDeniedUsers([]); 
    } catch (error) {
      console.error("Fel vid uppdatering av denylist:", error);
    }
  };


  return (
    <div className="columndiv3">
    <h2>Hitta din partner</h2>
    <label htmlFor="minAge">Ålder mellan:</label>
    <div className="age-filter-container">
    
    <input type="number" id="minAge"
    value={minAge} onChange={handleMinAgeChange}
    min="0" max="120" />
    
    <input type="number" id="maxAge"
    value={maxAge} onChange={handleMaxAgeChange}
    min="0" max="120" />
    </div>
    
    <div className="search-form">
    <label htmlFor="city">Stad:</label>
    <input  type="text" id="city"
    value={city}  onChange={(e) => setCity(e.target.value)}
    placeholder="Exempel: Stockholm" className="input-field" />
    
    <button onClick={filterUsers} disabled={loading} className="search-button">
    {loading ? 'Laddar...' : 'Sök partner'}
    </button>
    
    <button  onClick={restoreDeniedUsers} disabled={!isVip(user)} 
    className={`btn ${isVip(user) ? 'btn-primary' : 'btn-disabled'}`} >
    Återställ ❌  </button>
    
    </div>
    
    {matchingResults.length > 0 && showCurrentUser ? (
      <div className="results-item">
      <ul className="results-list">
      <li key={showCurrentUser.id} className="result-item">
      <div className="result-info">
      <h4>
     
      {showCurrentUser.vipPlusStatus ? (
  <img src={viploggaplus} alt="viploggaplus" className="vip-logo" />
) : showCurrentUser.vipStatus ? (
  <img src={viplogga} alt="viplogga" className="vip-logo" />
) : null}
      </h4>
      <div className={`status-inlog ${showCurrentUser.status?.online ? 'online' : 'offline'}`}></div>
       
      <h4>{showCurrentUser.firstName} <span className="age">, 
      <p>
      <strong>
      Ålder: {user?.age?.year && user?.age?.month && user?.age?.day 
        ? calculateAge(
          Number(user.age.year), 
          Number(user.age.month), 
          Number(user.age.day)
        ) 
        : 'Ej angivet'}
        </strong>
        </p> </span></h4>
      <p><strong>Matchar: {calculateMatch(showCurrentUser)}%</strong> </p>
      <p><strong>Kön:</strong> {showCurrentUser.gender}</p>
      <p><strong>Religion:</strong> {showCurrentUser.religion}</p>
      <p><strong>Läggning:</strong> {showCurrentUser.sexualOrientation}</p>
      <p> inloggad senast  : {showCurrentUser?.status?.lastLogin }</p>
      </div>
      <div className="life-statements">
      <p>Jag skulle aldrig kunna leva utan {showCurrentUser.lifeStatement1}</p>
      <p>Jag blir mest inspirerad när {showCurrentUser.lifeStatement2}</p>
      <p> {showCurrentUser?.status?.lastLogin }</p>
      
      {isVip(user) && (
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
      <div className='life-statements'> 
      {message && <p className="like-message">{message}</p>}
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


