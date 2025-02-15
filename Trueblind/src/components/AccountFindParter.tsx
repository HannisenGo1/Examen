import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import { User } from '../interface/interfaceUser';


export const FindPartners = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchingResults, setMatchingResults] = useState<User[]>([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
const [currentUser,setCurrentUser]= useState(0)
  const [nekadUser, setNekadUser] = useState<User[]>([]);
  const { user, likedUsers, addLikedUser } = useUserStore();

  if (!user) {
    return <p>Du måste vara inloggad för att söka efter partners.</p>;
  }

  const { gender: yourGender, sexualOrientation: yourSexualOrientation, id: yourId } = user;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Något gick fel vid hämtning av användare');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Fel vid hämtning av användare');
    } finally {
      setLoading(false);
    }
  };


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
      let isGenderMatch = false;
      const userSexualOrientation = user.sexualOrientation;
      const yourGenderLower = yourGender;
      const userGenderLower = user.gender;

      if (normalizedSexualOrientation === 'hetero') {
        if (yourGenderLower === 'male' && userGenderLower === 'female') {
          if (userSexualOrientation === 'hetero') {
            isGenderMatch = true;
          }
        } else if (yourGenderLower === 'female' && userGenderLower === 'male') {
          if (userSexualOrientation === 'hetero') {
            isGenderMatch = true;
          }
        }
      } else if (normalizedSexualOrientation === 'bi') {
        if (userSexualOrientation === 'bi') {
          isGenderMatch = true;
        }
      } else if (normalizedSexualOrientation === 'homo') {
        if (yourGenderLower === userGenderLower && userSexualOrientation === 'homo') {
          isGenderMatch = true;
        }
      }

      return isCityMatch && isGenderMatch;
    });


    setMatchingResults(filteredUsers);
    setCurrentUser(0); 
  };



  useEffect(() => {
    fetchUsers();
  }, []);


  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinAge(parseInt(e.target.value, 10));
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAge(parseInt(e.target.value, 10));
  };
// Lägg till användaren i gillalistan <3
  const handleLike = (userId: string) => {
    const likedUser = matchingResults.find((user) => user.id === userId);
    if (likedUser) {
      if (!likedUsers.some((user) => user.id === likedUser.id)) {
        addLikedUser(likedUser); 
        setMatchingResults(matchingResults.filter((user) => user.id !== likedUser.id)); 
        nextUser();
      } else {
        console.log("User already liked.");
      }
    }
  };
// lägg till användaren i neka listan X 
  const handleDeny = (userId: string) => {
    const deniedUser = matchingResults.find((user) => user.id === userId);
    if (deniedUser) {
      setMatchingResults(matchingResults.filter((user) => user.id !== userId));
      setNekadUser([...nekadUser, deniedUser]); 
      nextUser();
    }
  };
  const nextUser = () => {
    if (matchingResults.length > 0) {
      setCurrentUser((prevUser) => (prevUser + 1) % matchingResults.length); 
    } 
  };

// tömmer nekade listan & renderar igen när man klickar på " återställ "
  const restoreDeniedUsers = () => {
    setMatchingResults([...matchingResults, ...nekadUser]); 
    setNekadUser([]); 
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
        {nekadUser.length > 0 && (
              <button onClick={restoreDeniedUsers} className="restore-button">
                Återställ nekade användare
              </button>
            )}
      </div>

        {matchingResults.length > 0 ? (
          <div className="results-item">

            <ul className="results-list">
              {matchingResults.map((result) => {
                const matchPercentage = calculateMatch(result);

                return (


                  <li key={result.id} className="result-item">

                    <div className="result-info">
                      <h4>{result.firstName} <span className="age">, {result.age}</span></h4>
                      <p><strong>Kön:</strong> {result.gender}</p>
                      <p><strong>Religion:</strong> {result.religion}</p>
                      <p><strong>Matchning:</strong> {matchPercentage}%</p>
                      <p><strong>läggning:</strong> {result.sexualOrientation}</p>
                    </div>
                    <div className="life-statements">
                      <p>{result.lifeStatement1}</p>
                      <p>{result.lifeStatement2}</p>
                      <p>{result.ommig}</p>
                      <div className="button-container">
                        <button onClick={() => handleDeny(result.id!)} className="deny-button">
                        ❌</button>
   <button onClick={() => handleLike(result.id!)} className="like-button">
                        ❤️
                      </button>
                   
                      </div>

                    </div>
                  </li>
                );
              })}
            </ul>

          </div>
        ) : (
          <p className="no-results">Inga matchande resultat</p>
        )}
         {error && <p className="error-message">{error}</p>}
      </div>

  );
};


