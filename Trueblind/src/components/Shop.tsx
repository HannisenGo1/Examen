import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png';
import nalle1 from '../img/imgProdukter/nalle1.png';
import nalle2 from '../img/imgProdukter/nalle2.png';
import heart from '../img/imgProdukter/heart.png';
import {VipUser} from './VipUser';  
import {Vipinformation } from './Vipinfo';
import { updateUserInDatabase } from './data/UpdateDatabase';


export const Shop = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;
  const [promoCode, setPromoCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

// om användaren är null eller undefined ( när inloggning har löpt ut så navigerat man till startsidan.)
useEffect(() => {
  if (!user) {
    navigate('/');
  }
}, [user, navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      updateUser(parsedUser);
    }
  }, []);


  if (!user || !user.id) {
    return <p> Laddar ...  </p>;
  }

  const credits = user.credits || 0;

  // använda för att få gratis 1000 krediter. 
  const handlePromoCode = () => {
    const promoCodeCorrect = import.meta.env.VITE_PROMO_CODE;
    if (promoCode === promoCodeCorrect) {
      if (user.hasUsedPromoCode) {
        setErrorMessage("Du har redan använt din gratis kod.");
        return;
      }
      const updatedUser = {
        ...user,
        credits: credits + 1000,  
        hasUsedPromoCode: true, 
      };
      if (!user || !user.id) {
        console.error("User or user.id is undefined");
        return;
      }
      updateUser(updatedUser);
      localStorage.setItem(getUserStorageKey(user.id, 'userData'), JSON.stringify(updatedUser));

      setErrorMessage("");
    } else {
      setErrorMessage("Ogiltig kod. Försök igen.");
    }
  };

  const toggleOpenInfo = () => {
    setIsOpen(!isOpen);
  };


  // Hantering av köp -> VIP
  // kostar 80 krediter, men får tillbaka 20 tillgodo för att handla i shoppen
  const handleVIPPurchase = () => {
    if (credits < 80) {
      console.log("Du har inte tillräckligt med krediter för VIP!");
      return;
    }
    if (!user || !user.id) {
      console.error("Användare är undefined");
      return;
    }
    const newCredits = credits - 80 + 20; 

    const updatedUser = {
      ...user,
      credits: newCredits,  
      vipStatus: true,  
      vipPlusStatus: false,  
      vipExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, 
    };
  
    updateUserInDatabase(updatedUser); 
    console.log('datan för användaren som har köpt:', updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser));  
  };

// VIP+ STATUS:::
const handleVIPPlusPurchase = () => {
  if (credits < 100) {
    console.log("Du har inte tillräckligt med krediter för VIP Plus!");
    return;
  }
  if (!user || !user.id) {
    console.error("User or user.id is undefined");
    return;
  }
  const newCredits = credits - 100 + 20; 
  const updatedUser = {
    ...user,
    credits: newCredits,  
    vipStatus: true, 
    vipPlusStatus: true,
    vipPlusExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, 
    vipExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
// uppdaterar både in till firebase, så jag kan hålla reda på vilka användare som har vip, och även
// sparar in till localstorage. 
  updateUserInDatabase(updatedUser);  
  localStorage.setItem('user', JSON.stringify(updatedUser)); 
};


  const emojis = [
    { name: "nalle1", src: nalle1, price: 3 },
    { name: "nalle2", src: nalle2, price: 3 },
    { name: "bukett", src: bukett, price: 3 },
    { name: "heart", src: heart, price: 2 },
  ];

  const emojisFor1Credit = emojis.filter((emoji) => emoji.price === 2);
  const emojisFor3Credits = emojis.filter((emoji) => emoji.price === 3);

  // Hantera köp av emoji
  const handlePurchase = (emojiName: string, price: number) => {
    if (credits < price) {
      console.log("Du har inte tillräckligt med krediter!");
      return;
    }

    const existingEmoji = user.purchasedEmojis?.find((e) => e.emoji === emojiName);
    const updatedEmojis = existingEmoji
      ? user.purchasedEmojis.map((e) =>
          e.emoji === emojiName ? { ...e, count: e.count + 1 } : e
        )
      : [...(user.purchasedEmojis || []), { emoji: emojiName, count: 1 }];

      if (!user || !user.id) {
        console.error("User or user.id is undefined");
        return;
      }

    const updatedUser = { 
      credits: credits - price,
      purchasedEmojis: updatedEmojis 
    };
    updateUser(updatedUser);
    localStorage.setItem(getUserStorageKey(user.id, 'userData'), JSON.stringify(updatedUser)); 
  };

  // Köp av gratis krediter :D 
  const handleAddCredits = (amount: number) => {
    if (!user || !user.id) {
      console.error("User or user.id is undefined");
      return;
    }
    const newCredits = credits + amount;
    const updatedUser = { ...user, credits: newCredits };
    
    updateUser(updatedUser);
    localStorage.setItem(getUserStorageKey(user.id, 'userData'), JSON.stringify(updatedUser)); 
  };

  return (
    <>
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>

      <button onClick={() => navigate('/account')} className="btnback">
        <i className="fas fa-arrow-left"></i>
      </button>

      <h1 className="Rubriktext">
        <span className="firstPart">SHOPPEN</span>
      </h1>
      <div className="emoji-shop">
<p className="price-text">Din kredit: {credits}</p> </div> 
 
      <button className="vipinfobtn"onClick={toggleOpenInfo}> VIP information
      <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
          &#9660;
        </span>
        </button>
        {isOpen  && (
  <Vipinformation />

)}

 <div className="buybtncontainer">
      <VipUser user={user} onVIPPurchase={handleVIPPurchase} onVIPPlusPurchase={handleVIPPlusPurchase} /> 
      <button onClick={handleVIPPlusPurchase} className="shopBtn">
  VIP PLUS ( 100 krediter)
</button>
     
        <button onClick={() => handleAddCredits(10)} className="shopBtn">
          10 krediter, 22.90 kronor
        </button>
        <button onClick={() => handleAddCredits(30)} className="shopBtn">
          30 krediter, 64.90 kronor
        </button>
        <button onClick={() => handleAddCredits(60)} className="shopBtn">
          60 krediter, 92.90 kronor
        </button>
        <button onClick={() => handleAddCredits(100)} className="shopBtn">
          100 krediter, 149.90 kronor
        </button>

      </div>
{/* Promo code section */}
<div className="promo-code-section">
        <input 
          type="text" 
          placeholder="Ange din kod här" 
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="promo-code-input"
        />
        <button onClick={handlePromoCode} className="apply-code-btn">
          Använd kod
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      {/* Emoji-shop */}
      <div className="emoji-shop">
        {emojisFor1Credit.length > 0 && (
          <div className="emoji-group">
            <p className="price-text">Pris: 2 kredit per emoji</p>
            <div className="emoji-picker2">
              {emojisFor1Credit.map((emoji) => (
                <div key={emoji.name} className="emoji-item">
                  <img 
                    src={emoji.src} 
                    alt={emoji.name} 
                    className={`emoji ${credits < emoji.price ? "disabled" : ""}`} 
                    onClick={() => handlePurchase(emoji.name, emoji.price)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {emojisFor3Credits.length > 0 && (
          <div className="emoji-group">
            <p className="price-text">Pris: 3 krediter per emoji</p>
            <div className="emoji-picker2">
              {emojisFor3Credits.map((emoji) => (
                <div key={emoji.name} className="emoji-item">
                  <img 
                    src={emoji.src} 
                    alt={emoji.name} 
                    className={`emoji ${credits < emoji.price ? "disabled" : ""}`} 
                    onClick={() => handlePurchase(emoji.name, emoji.price)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visar köpta emojis */}
      <div className="emoji-purchased">
        <p>Du har köpt:</p>
        <div className="emoji-picker2">
          {user.purchasedEmojis?.length > 0 ? (
            user.purchasedEmojis.map((emoji) => {
              const emojiData = emojis.find((e) => e.name === emoji.emoji);
              return emojiData ? (
                <div key={emoji.emoji} className="emoji-item">
                  <img src={emojiData.src} alt={emoji.emoji} className="emoji" />
                  <p>{emoji.count} st</p>
                </div>
              ) : null;
            })
          ) : (
            <p>Du har inte köpt några emojis än.</p>
          )}
        </div>
      </div>
    </>
  );
};
