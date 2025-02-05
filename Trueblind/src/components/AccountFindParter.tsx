import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import { User } from '../interface/interfaceUser';

export const SearchPartners = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchingResults, setMatchingResults] = useState<User[]>([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { user, likedUsers, addLikedUser } = useUserStore();

  if (!user) {
    return <p>Du måste vara inloggad för att söka efter partners.</p>;
  }

  const { age: yourAge, gender: yourGender, sexualOrientation: yourSexualOrientation } = user;
  const minAgeCalculated = yourAge - 5;
  const maxAgeCalculated = yourAge + 10;

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

  const filterUsers = () => {
    const filteredUsers = users.filter((user: User) => {
      const userAge = typeof user.age === 'string' ? parseInt(user.age, 10) : user.age;
      const isAgeMatch = userAge >= minAgeCalculated && userAge <= maxAgeCalculated;

      const isCityMatch = city ? user.city.toLowerCase().trim() === city.toLowerCase().trim() : true;
      let isGenderMatch = false;

      if (yourSexualOrientation.toLowerCase() === 'hetero') {
        if ((yourGender.toLowerCase() === 'female' && user.gender.toLowerCase() === 'male') || 
            (yourGender.toLowerCase() === 'male' && user.gender.toLowerCase() === 'female')) {
          isGenderMatch = true;
        }
      } else if (yourSexualOrientation.toLowerCase() === 'bi') {
        if ((user.gender.toLowerCase() === 'female' || user.gender.toLowerCase() === 'male') &&
            user.sexualOrientation.toLowerCase() === 'bi') {
          isGenderMatch = true;
        }
      } else if (yourSexualOrientation.toLowerCase() === 'homo') {
        if (yourGender.toLowerCase() === user.gender.toLowerCase() &&
            user.sexualOrientation.toLowerCase() === 'homo') {
          isGenderMatch = true;
        }
      }

      return isAgeMatch && isCityMatch && isGenderMatch;
    });

    setMatchingResults(filteredUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Liked users updated:", likedUsers);
  }, [likedUsers]); 

  const handleLike = (userId: string) => {
    console.log("Liked users before:", likedUsers);
  
    const likedUser = users.find((user) => user.id === userId);  
    if (likedUser) {
      if (!likedUsers.some((user) => user.id === likedUser.id)) { 
        addLikedUser(likedUser);  
      } else {
        console.log("User already liked.");
      }
    }
  
    console.log("After like:", likedUsers);
  };
  

  const checkForMatch = (userId: string) => {
    return likedUsers.includes(user) && user.id === userId;  
  };

  return (
    <div className="columndiv3">
      <h2>Hitta en partner</h2>
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
      </div>

      <div className="results-container">
        {matchingResults.length > 0 ? (
          <div className="results">
            <h3 className="results-heading">Matchande resultat:</h3>
            <ul className="results-list">
              {matchingResults.map((result) => (
                <li key={result.id} className="result-item">
                  <div className="result-info">
                    <button onClick={() => handleLike(result.id!)} className="like-button">
                      ❤️
                    </button>
                    <h4>{result.firstName} <span className="age">, {result.age}</span></h4>
                    <p><strong>Kön:</strong> {result.gender}</p>
                    <p><strong>Religion:</strong> {result.religion}</p>

                    {checkForMatch(result.id!) && <p>Det är en match! 🎉</p>}
                  </div>
                  <div className="life-statements">
                    <p>{result.lifeStatement1}</p>
                    <p>{result.lifeStatement2}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-results">Inga matchande resultat</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchPartners;

