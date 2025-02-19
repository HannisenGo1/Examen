import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';


export const AccountPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
const [message,setMessage] = useState('')

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    city: false,
    sexualOrientation: false,

  });
  const [updatedUserData, setUpdatedUserData] = useState({
    city: user ? user.city : '',
    sexualOrientation: user ? user.sexualOrientation : '',

  });

  useEffect(() => {
    if (user) {
      setUpdatedUserData({
        city: user.city,
        sexualOrientation: user.sexualOrientation,
 
      });
    }
    console.log('Användardata har uppdaterats:', user);
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
      [field]: true,
    }));
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: name === 'interests' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Ändringarna har sparats!"); 
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        console.log('Användardata uppdaterad:', updatedUser);
      } else {
        console.error('Uppdatering misslyckades');
      }
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
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
      <div className="buttondivforback">
    <button className="btnback" onClick={() => navigate('/homepage')}>
        <i className="fas fa-arrow-left"></i>
      </button> </div> 

      <div className="result-info"> 
  <button onClick={() => navigate('/')} className="btnmatchsite">
          Logga ut
        </button> </div> 
  

      <div className="result-info">
        <button onClick={() => navigate('/match')} className="btnmatchsite">
          Dina Gillade
        </button>
        <button onClick={() => navigate('/messages')} className="btnmatchsite">
          Meddelanden & Förfrågningar
        </button>
      
        <button className="btnmatchsite" onClick={() => navigate('/shop')}> Till shoppen </button> 
      </div>


      <h2 className="confirmation-message">
        Dina uppgifter:
        <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
          &#9660;
        </span>
      </h2>
      {isOpen && (
        <div className="columndiv2">
          <p className="capitalize-first-letter::first-letter">
            <strong>Ditt namn: {user.firstName}</strong>
          </p>

          <p>
            <strong>Ålder: {user.age} </strong>
 
          </p>

          <p className="capitalize-first-letter::first-letter">
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

          <p className="capitalize-first-letter::first-letter">
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
          <button className=""> Radera ditt konto </button> 

            <button type="submit" className="accountBtn"onClick={handleSubmit} >
            Spara
            </button>
            {message && <p>{message}</p>} 
        </div>
      )}

      
    </>
  );
};
