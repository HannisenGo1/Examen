import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa'; // Importera penna-ikonen

export const AccountPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState({ 
    firstName: false,
    age: false,
    city: false,
    sexualOrientation: false,
    interests: false
  });
  const [updatedUserData, setUpdatedUserData] = useState({
    firstName: user ? user.firstName : '',
    age: user ? user.age : '',
    city: user ? user.city : '',
    sexualOrientation: user ? user.sexualOrientation : '',
    interests: user ? user.interests : '',
  });

  useEffect(() => {
    if (user) {
      setUpdatedUserData({
        firstName: user.firstName,
        age: user.age,
        city: user.city,
        sexualOrientation: user.sexualOrientation,
        interests: user.interests,
      });
    }
    console.log("Användardata har uppdaterats:", user);
  }, [user]);

  if (!user) {
    return <div>Inga användardata tillgängliga</div>;
  }

  const toggleOpenInfo = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = (field: string) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: true
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("Användardata uppdaterad:", updatedUser);
        console.log("Uppdatering lyckades!");
      } else {
        console.error("Uppdatering misslyckades");
        console.log("Det gick inte att uppdatera användardata.");
      }
    } catch (error) {
      console.error("Fel vid uppdatering:", error);
      console.log("Ett fel uppstod vid uppdatering av användardata.");
    }
  };

  return (
    <>
      <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>

      <h1 className="Rubriktext">
        <span className="firstPart">KO</span>
        <span className="secondPart">NT</span>
        <span className="firstPart">O</span>
      </h1>

      <button className="btnback" onClick={() => navigate('/homepage')}>
        <i className="fas fa-arrow-left"></i>
      </button>

      <h2 className="confirmation-message">
        Dina uppgifter:
        <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>&#9660;</span>
      </h2>
      {isOpen && (
        
          <div className="columndiv2">

              <p> <strong>Ditt namn: {user.firstName}</strong>     </p>

              <p>
                <strong>Ålder:</strong>
                {isEditing.age ? (
                  <input
                    type="number"
                    name="age"
                    value={updatedUserData.age}
                    onChange={handleChange}
                    onBlur={() => setIsEditing((prev) => ({ ...prev, age: false }))}
                  />
                ) : (
                  <>
                    {updatedUserData.age}
                    <FaPen className="edit-icon" onClick={() => handleEditClick('age')} />
                  </>
                )}
              </p>

              <p>
                <strong>Stad:</strong>
                {isEditing.city ? (
                  <input
                    type="text"
                    name="city"
                    value={updatedUserData.city}
                    onChange={handleChange}
                    onBlur={() => setIsEditing((prev) => ({ ...prev, city: false }))}
                  />
                ) : (
                  <>
                    {updatedUserData.city}
                    <FaPen className="edit-icon" onClick={() => handleEditClick('city')} />
                  </>
                )}
              </p>

              <p>
                <strong>Sexuell läggning:</strong>
                {isEditing.sexualOrientation ? (
                  <input
                    type="text"
                    name="sexualOrientation"
                    value={updatedUserData.sexualOrientation}
                    onChange={handleChange}
                    onBlur={() => setIsEditing((prev) => ({ ...prev, sexualOrientation: false }))}
                  />
                ) : (
                  <>
                    {updatedUserData.sexualOrientation}
                    <FaPen className="edit-icon" onClick={() => handleEditClick('sexualOrientation')} />
                  </>
                )}
              </p>

              <p>
                <strong>Dina intressen:</strong>
                {isEditing.interests ? (
                  <input
                    type="text"
                    name="interests"
                    value={updatedUserData.interests}
                    onChange={handleChange}
                    onBlur={() => setIsEditing((prev) => ({ ...prev, interests: false }))}
                  />
                ) : (
                  <>
                    {updatedUserData.interests}
                    <FaPen className="edit-icon" onClick={() => handleEditClick('interests')} />
                  </>
                )}
              </p><form onSubmit={handleSubmit}>
        <button type="submit" className="btnmatchsite">Uppdatera</button>
      </form>
            </div>   
        
     
      )}

   

      <div className="result-info">
        <button onClick={() => navigate('/match')} className="btnmatchsite">Matchsidan</button>
        <button onClick={() => navigate('/messages')} className="btnmatchsite">Meddelanden</button>
        <button onClick={() => navigate('/')} className="btnmatchsite">Logga ut</button>
      </div>
    </>
  );
};
