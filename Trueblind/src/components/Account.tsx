import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import {auth} from './data/firebase'
import { DeleteUser } from './data/UserAuth';
import { isVIPExpired } from './VipUser';
import { User } from '../interface/interfaceUser';
import { daysRemaining } from './DaysCounterVip';


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
  const isVip = (user: User | undefined) => {
    return user?.vipStatus || user?.vipPlusStatus ||false;
  }

  const doSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Användaren har loggat ut.");
      navigate ('/')
    } catch (error) {
      console.error("Fel vid utloggning:", error);
    }
  };

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
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevState) => ({
      ...prevState,
      [name]: value,
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
  const hasActiveVipPlus = user.vipPlusStatus && !isVIPExpired(user.vipPlusExpiry);
  const hasActiveVip = user.vipStatus && !isVIPExpired(user.vipExpiry);

  const vipDaysLeft = daysRemaining(user.vipExpiry);
  const vipPlusDaysLeft = daysRemaining(user.vipPlusExpiry);

  const calculateAge = (birthdate: { year: number; month: number; day: number }) => {
    const today = new Date();
    const birthDate = new Date(birthdate.year, birthdate.month - 1, birthdate.day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Ändringarna har sparats!"); 
  
    try {
      const token = await auth.currentUser?.getIdToken();
  
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error('Uppdatering misslyckades:', await response.text());
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
    </button>
    </div>
    
    {/* Navigering */}
    <div className="result-info">
    <button onClick={doSignOut} className="btnmatchsite">Logga ut</button>
    </div>
    <div className="result-info">
    <button onClick={() => navigate('/match')} className="btnmatchsite">Dina Gillade</button>
    <button onClick={() => navigate('/messages')} className="btnmatchsite">Meddelanden & Förfrågningar</button>
    <button onClick={() => navigate('/shop')} className="btnmatchsite">Till shoppen</button>
    </div>
    
    {/* information */}
    <h2 className="confirmation-message">
    Dina uppgifter:
    <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
    &#9660;
    </span>
    </h2>
    
    {isOpen && (
      <div className="columndiv2">
      <p><strong>Ditt namn: {user.firstName}</strong></p>
      <p><strong>Ålder: {user?.age?.year ? `${user.age.year}-${user.age.month}-${user.age.day}` : 'Ej angivet'}</strong></p>



      {hasActiveVipPlus ? (
        <p>Du har <strong>VIP Plus</strong>. 
        {vipPlusDaysLeft > 0 ? `Det är ${vipPlusDaysLeft} dagar kvar på din VIP Plus.` : ''}</p>
      ) : hasActiveVip ? (
        <p>Du har <strong>VIP</strong>. 
        {vipDaysLeft > 0 ? `Det är ${vipDaysLeft} dagar kvar på din VIP.` : ''}</p>
      ) : (
        <p>Du har ingen aktiv VIP-status.</p>
      )}
 

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
    <div>
      <label htmlFor="sexualOrientation">Sexuell läggning</label>
      <select
        id="sexualOrientation"
        name="sexualOrientation"
        value={updatedUserData.sexualOrientation}
        onChange={handleChange}
        onBlur={() => setIsEditing((prev) => ({ ...prev, sexualOrientation: false }))}
      >
        <option value="">Välj sexuell läggning</option>
        <option value="Hetero">Hetero</option>
        <option value="Homo">Homo</option>
        <option value="Bi">Bisexuell</option>
        <option value="other">Annat</option>
      </select>
    </div>
  ) : (
    <>
      {updatedUserData.sexualOrientation || "Ej angiven"}
      <FaPen className="edit-icon" onClick={() => handleEditClick("sexualOrientation")} />
    </>
  )}
</p>
      
      {/* Radera konto-knapp */}
      <button className="delete-btn" onClick={() => setShowConfirm(true)}>
      Radera konto?
      </button>
      
      {/* val om man är säker att radera sitt konto :)  */}
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
