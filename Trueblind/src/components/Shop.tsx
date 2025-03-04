import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png';
import nalle1 from '../img/imgProdukter/nalle1.png';
import nalle2 from '../img/imgProdukter/nalle2.png';
import heart from '../img/imgProdukter/heart.png';
import { Vipinformation } from './Vipinfo';
import { updateUserInDatabase } from './data/UpdateDatabase';

export const Shop = () => {
  const navigate = useNavigate();
  const { user,setUser } = useUserStore();
  const [promoCode, setPromoCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState(user?.credits || 0);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const prices = {
    VIP: 80,
    VIPPlus: 100,
    emojis: {
      nalle1: 3,
      nalle2: 3,
      bukett: 3,
      heart: 2,
    },
  };

  if (!user || !user.id) {
    return <p>Laddar...</p>;
  }

  const handlePromoCode = async () => {
    const promoCodeCorrect = import.meta.env.VITE_PROMO_CODE;
    if (promoCode === promoCodeCorrect) {
      if (user.hasUsedPromoCode) {
        setErrorMessage("Du har redan använt din gratis kod.");
        return;
      }
      const updatedUser = { ...user, credits: credits + 1000, hasUsedPromoCode: true };
      await updateUserInDatabase(updatedUser);
      setCredits(updatedUser.credits);
      setErrorMessage("");
    } else {
      setErrorMessage("Ogiltig kod. Försök igen.");
    }
  };

  const toggleOpenInfo = () => setIsOpen(!isOpen);
 
  console.log("Användarens köpta emojis:", user.purchasedEmojis);
  
  type PurchaseType = 'VIP' | 'VIPPlus' ;

  interface Emoji {
    name: string;
    src: string;
    price: number;
  }

  // Hantera köper för emojisar :D 
  const handlePurchaseEmoji = async (emojiName: string, price: number) => {
    console.log(`Försöker köpa emoji: ${emojiName} för ${price} krediter`);
  
    if (credits < price) {
      setErrorMessage("Du har inte tillräckligt med krediter!");
      return;
    }
  
    const updatedCredits = credits - price;
    setCredits(updatedCredits);
  
    const existingEmoji = user.purchasedEmojis?.find((e) => e.emoji === emojiName);
    console.log("Existerande emoji:", existingEmoji);

    const updatedEmojis = existingEmoji
      ? user.purchasedEmojis.map((e) =>
          e.emoji === emojiName ? { ...e, count: e.count + 1 } : e
        )
      : [...(user.purchasedEmojis || []), { emoji: emojiName, count: 1 }];
    
    console.log("Köpta emojis efter uppdatering:", updatedEmojis);
  
    const updatedUser = {
      ...user,
      credits: updatedCredits,
      purchasedEmojis: updatedEmojis,
    };
  
    console.log("Uppdaterat användarobjekt:", updatedUser);
  
    try {
      await updateUserInDatabase(updatedUser);
      console.log("Användaren uppdaterades  i databasen");
  
      setUser(updatedUser);  
    } catch (error) {
      console.error("Något gick fel vid uppdateringen av användaren:", error);
    }
  };
  
  
// Köpa kredit
  const handleAddCredits = async (amount: number): Promise<void> => {
    const newCredits = credits + amount;
    const updatedUser = { ...user, credits: newCredits };
    await updateUserInDatabase(updatedUser);
    setCredits(newCredits); 
  };

  const emojis = [
    { name: "nalle1", src: nalle1, price: 3 },
    { name: "nalle2", src: nalle2, price: 3 },
    { name: "bukett", src: bukett, price: 3 },
    { name: "heart", src: heart, price: 2 },
  ];

  const renderEmojis = (emojis: Emoji[]) => (
    <div className="emoji-group">
      {emojis.map((emoji) => {
        const purchasedEmojis = Array.isArray(user.purchasedEmojis) ? user.purchasedEmojis : [];
        const userEmoji = purchasedEmojis.find((e) => e.emoji === emoji.name);
        const emojiCount = userEmoji ? userEmoji.count : 0;
  
        return (
          <div key={emoji.name} className="emoji-item">
            <img
              src={emoji.src}
              alt={emoji.name}
              className={`emoji ${credits < emoji.price ? "disabled" : ""}`}
              onClick={() => handlePurchaseEmoji(emoji.name, emoji.price)}
            />
            <p className="price-text">{emoji.price} kredit(er)</p>
  
            {emojiCount > 0 && <p className="emoji-count">Du har {emojiCount}</p>}
          </div>
        );
      })}
    </div>
  );
  const handlePurchase = async (type: PurchaseType, price: number): Promise<void> => {
    if (credits < price) {
      setErrorMessage("Du har inte tillräckligt med krediter!");
      return;
    }

    try {
      let updatedUser = { ...user, credits: credits - price };
      setCredits(updatedUser.credits); 

      switch (type) {
        case 'VIP':
          updatedUser = {
            ...updatedUser,
            vipStatus: true,
            vipExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
          };
          break;

        case 'VIPPlus':
          updatedUser = {
            ...updatedUser,
            vipStatus: true,
            vipPlusStatus: true,
            vipPlusExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
          };
          break;

        }
  
      await updateUserInDatabase(updatedUser);
    } catch (error) {
      console.error("Något gick fel vid köpet:", error);
    }
  };
  return (
    <>
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>

      <button onClick={() => navigate('/account')} className="btnback">
        <i className="fas fa-arrow-left"></i>
      </button>

      <h1 className="Rubriktext">SHOPPEN</h1>
      <p className="price-text">Din kredit: {credits}</p>

      <button className="vipinfobtn" onClick={toggleOpenInfo}>VIP information</button>
      {isOpen && <Vipinformation />}

      <div className="vip-status">
        {user.vipStatus && (
          <p>VIP : Aktiv</p>
        )}
        {user.vipPlusStatus && (
          <p>VIP Plus: Aktiv</p>
        )}
      </div>

      <div className="buybtncontainer">
        <button onClick={() => handlePurchase('VIP', prices.VIP)} className="shopBtn">
          VIP (80 krediter)
        </button>

        <button onClick={() => handlePurchase('VIPPlus', prices.VIPPlus)} className="shopBtn">
          VIP PLUS (100 krediter)
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

      <div className="promo-code-section">
        <input
          type="text"
          placeholder="Ange din kod här"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={handlePromoCode}>Använd kod</button>
        {errorMessage && <p>{errorMessage}</p>}
      </div>

      <div className="emoji-picker2">
        <div className="emoji-item">
          {renderEmojis(emojis)}
        </div>
      </div>
    </>
  );
};
