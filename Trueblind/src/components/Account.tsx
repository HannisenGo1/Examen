import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { auth } from "../data/firebase";
import { DeleteUser } from './data/UserAuth';

export const AccountPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
  const [message,setMessage] = useState('')
  const [showConfirm,setShowConfirm]= useState(false);
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
  
  
  
  const handleDelete = async () => {
    try {
      if (!auth.currentUser) {
        console.error("Ingen användare inloggad!");
        return;
      }
      await DeleteUser(auth.currentUser.uid);
      
    } catch (error) {
      console.error("Misslyckades att radera kontot:", error);
    }
  }
  
  const doSignOut = async () => {
    await auth.signOut();
    useUserStore.getState().resetUser(); 
    navigate ('/')
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
       
      } else {
        console.error('Uppdatering misslyckades');
      }
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
    }
  };
  
  return (
    <>
    {/* Logga och rubrik */}
    <div className="logga">
    <img src={logga} alt="picture" className="img" />
    </div>
    <h1 className="Rubriktext">
    <span className="firstPart">KO</span>
    <span className="secondPart">NT</span>
    <span className="firstPart">O</span>
    </h1>
    
    {/* Tillbaka-knapp */}
    <div className="buttondivforback">
    <button className="btnback" onClick={() => navigate('/homepage')}>
    <i className="fas fa-arrow-left"></i>
    </button>
    </div>
    
    {/* Navigeringsknappar */}
    <div className="result-info">
    <button onClick={doSignOut} className="btnmatchsite">Logga ut</button>
    </div>
    <div className="result-info">
    <button onClick={() => navigate('/match')} className="btnmatchsite">Dina Gillade</button>
    <button onClick={() => navigate('/messages')} className="btnmatchsite">Meddelanden & Förfrågningar</button>
    <button onClick={() => navigate('/shop')} className="btnmatchsite">Till shoppen</button>
    </div>
    
    {/* Användarinformation */}
    <h2 className="confirmation-message">
    Dina uppgifter:
    <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
    &#9660;
    </span>
    </h2>
    
    {isOpen && (
      <div className="columndiv2">
      <p><strong>Ditt namn: {user.firstName}</strong></p>
      <p><strong>Ålder: {user.age}</strong></p>
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
        <FaPen className="edit-icon" onClick={() => handleEditClick("city")} />
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
        <FaPen className="edit-icon" onClick={() => handleEditClick("sexualOrientation")} />
        </>
      )}
      </p>
      
      {/* Radera konto-knapp */}
      <button className="delete-btn" onClick={() => setShowConfirm(true)}>
      Radera konto?
      </button>
      
      {/* Bekräftelse-popup */}
      {showConfirm && (
        <div className="confirmation-box">
        <p>Är du säker på att du vill radera ditt konto? <br />
        <span className="text-red">Hela kontot kommer att raderas.</span>
        </p>
        <div className="optiondeletecancel">
        <button className="cancel-btn" onClick={() => setShowConfirm(false)} >
        Avbryt
        </button>
        <button className="delete-btn" onClick={handleDelete} >
        Radera
        </button>
        </div>
        </div>
      )}
      
      {/* Spara-knapp */}
      <button type="submit" className="accountBtn" onClick={handleSubmit}>
      Spara
      </button>
      {message && <p>{message}</p>}
      </div>
    )}
    </>
  );
};
