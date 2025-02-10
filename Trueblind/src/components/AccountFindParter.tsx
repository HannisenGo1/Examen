import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import { User } from '../interface/interfaceUser';

export const SearchPartners = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matchingResults, setMatchingResults] = useState<User[]>([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [minAge, setMinAge] = useState(18);  
  const [maxAge, setMaxAge] = useState(100); 

  const { user, likedUsers, addLikedUser } = useUserStore();

  if (!user) {
    return <p>Du måste vara inloggad för att söka efter partners.</p>;
  }

  const { gender: yourGender, 
    sexualOrientation: yourSexualOrientation,
     religion: yourReligion } = user;

  // Fetch användare från API
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

  // Beräkna matchning mellan användare med deras egenskaper.
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
    const filteredUsers = users.filter((user: User) => {
      const userAge = typeof user.age === 'string' ? parseInt(user.age, 10) : user.age;

      const isAgeMatch = userAge >= minAge && userAge <= maxAge;


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
      const isReligionMatch = user.religion ? user.religion.toLowerCase() === yourReligion.toLowerCase() : true;

      return isAgeMatch && isCityMatch && isGenderMatch && isReligionMatch;
    });

    setMatchingResults(filteredUsers);
  };

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinAge(parseInt(e.target.value, 10));
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAge(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLike = (userId: string) => {
    const likedUser = users.find((user) => user.id === userId);  
    if (likedUser) {
      if (!likedUsers.some((user) => user.id === likedUser.id)) { 
        addLikedUser(likedUser);  
      } else {
        console.log("User already liked.");
      }
    }
  };

  return (
    <div className="columndiv3">
      <h2>Hitta en partner</h2>
      
      <div className="age-filter-container">
  <label htmlFor="minAge">Från ålder:</label>
  <input
    type="number"
    id="minAge"
    value={minAge}
    onChange={handleMinAgeChange}
    min="0"
    max="120"
  />
  <label htmlFor="maxAge">Till ålder:</label>
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
      </div>

      <div className="results-container">
        {matchingResults.length > 0 ? (
          <div className="results">
            <h3 className="results-heading">Matchande resultat:</h3>
            <ul className="results-list">
              {matchingResults.map((result) => {
                const matchPercentage = calculateMatch(result);

                return (
                  <li key={result.id} className="result-item">
                    <div className="result-info">
                      <button onClick={() => handleLike(result.id!)} className="like-button">
                        ❤️
                      </button>
                      <h4>{result.firstName} <span className="age">, {result.age}</span></h4>
                      <p><strong>Kön:</strong> {result.gender}</p>
                      <p><strong>Religion:</strong> {result.religion}</p>
                      <p><strong>Matchning:</strong> {matchPercentage}%</p>
                    </div>
                    <div className="life-statements">
                      <p>{result.lifeStatement1}</p>
                      <p>{result.lifeStatement2}</p>
                    </div>
                  </li>
                );
              })}
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
