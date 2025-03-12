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
    const { user, setUser, updatePromoCodeStatus } = useUserStore();
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
    useEffect(() => {
        if (user) {
            if (user.hasUsedPromoCode) {
                setErrorMessage("");
            }
        }
    }, [user]);
    const handlePromoCode = async () => {
        const promoCodeCorrect = import.meta.env.VITE_PROMO_CODE;
        if (promoCode === promoCodeCorrect) {
            if (user.hasUsedPromoCode) {
                setErrorMessage("Du har redan använt din gratis kod.");
                return;
            }
            const updatedUser = { ...user, credits: credits + 1000, hasUsedPromoCode: true };
            console.log("Uppdaterad användare med ny rabattkod:", updatedUser);
            try {
                await updateUserInDatabase(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                updatePromoCodeStatus(true);
                setCredits(updatedUser.credits);
                setErrorMessage("");
            }
            catch (error) {
                setErrorMessage("Något gick fel vid uppdatering. Försök igen senare.");
                console.error(error);
            }
        }
        else {
            setErrorMessage("Ogiltig kod. Försök igen.");
        }
    };
    const toggleOpenInfo = () => setIsOpen(!isOpen);
    // Hantera köper för emojisar :D 
    const handlePurchaseEmoji = async (emojiName, price) => {
        if (credits < price) {
            setErrorMessage("Du har inte tillräckligt med krediter!");
            return;
        }
        const updatedCredits = credits - price;
        setCredits(updatedCredits);
        const purchasedEmojis = Array.isArray(user?.purchasedEmojis) ? user.purchasedEmojis : [];
        const existingEmoji = purchasedEmojis.find((e) => e.emoji === emojiName);
        const updatedEmojis = existingEmoji
            ? purchasedEmojis.map((e) => e.emoji === emojiName ? { ...e, count: e.count + 1 } : e)
            : [...purchasedEmojis, { emoji: emojiName, count: 1 }];
        const updatedUser = {
            ...user,
            credits: updatedCredits,
            purchasedEmojis: updatedEmojis,
        };
        try {
            await updateUserInDatabase(updatedUser);
            setUser(updatedUser);
        }
        catch (error) {
            console.error(error);
        }
    };
    // Köpa kredit
    const handleAddCredits = async (amount) => {
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
    const renderEmojis = (emojis) => {
        const emojisFor3Credits = emojis.filter(emoji => emoji.price === 3);
        const emojisFor2Credits = emojis.filter(emoji => emoji.price === 2);
        return (<div className="emoji-group">
        {/* Emoji med 3 krediter */}
        <div className="emoji-price-group">
          <h2>Kostnad: 3 krediter</h2>
          <div className="emoji-list">
            {emojisFor3Credits.map((emoji) => {
                const purchasedEmojis = Array.isArray(user.purchasedEmojis) ? user.purchasedEmojis : [];
                const userEmoji = purchasedEmojis.find((e) => e.emoji === emoji.name);
                const emojiCount = userEmoji ? userEmoji.count : 0;
                return (<div key={emoji.name} className="emoji-item" onClick={() => handlePurchaseEmoji(emoji.name, emoji.price)}>
                  <img src={emoji.src} alt={emoji.name} className={`emoji ${credits < emoji.price ? "disabled" : ""}`}/>
                  
                  {emojiCount > 0 && <p className="emoji-count"><strong>  {emojiCount}</strong></p>}
                </div>);
            })}
          </div>
        </div>
  
        {/* Emoji med 2 krediter */}
        <div className="emoji-price-group">
          <h2>Kostnad: 2 krediter</h2>
          <div className="emoji-list">
            {emojisFor2Credits.map((emoji) => {
                const purchasedEmojis = Array.isArray(user.purchasedEmojis) ? user.purchasedEmojis : [];
                const userEmoji = purchasedEmojis.find((e) => e.emoji === emoji.name);
                const emojiCount = userEmoji ? userEmoji.count : 0;
                return (<div key={emoji.name} className="emoji-item" onClick={() => handlePurchaseEmoji(emoji.name, emoji.price)}>
                  <img src={emoji.src} alt={emoji.name} className={`emoji ${credits < emoji.price ? "disabled" : ""}`}/>
                
                  {emojiCount > 0 && <p className="emoji-count"><strong> {emojiCount}</strong></p>}
                </div>);
            })}
          </div>
        </div>
      </div>);
    };
    const handlePurchase = async (type, price) => {
        if (credits < price) {
            setErrorMessage("Du har inte tillräckligt med krediter!");
            return;
        }
        try {
            let updatedUser = { ...user, credits: credits - price };
            setCredits(updatedUser.credits);
            const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
            switch (type) {
                case 'VIP':
                    updatedUser = {
                        ...updatedUser,
                        vipStatus: true,
                        vipExpiry: expiryDate,
                    };
                    break;
                case 'VIPPlus':
                    updatedUser = {
                        ...updatedUser,
                        vipStatus: true,
                        vipPlusStatus: true,
                        vipPlusExpiry: expiryDate,
                    };
                    break;
            }
            await updateUserInDatabase(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        catch (error) {
            console.error(error);
        }
    };
    return (<>
      <div className="logga">
        <img src={logga} alt="logo" className="img"/>
      </div>

      <button onClick={() => navigate('/account')} className="btnback">
        <i className="fas fa-arrow-left"></i>
      </button>

      <h1 className="Rubriktext">
      <span className="firstPart"> SHOPPEN </span> </h1>
      <p className="price-text">Din kredit: {credits}</p>
      <div className="vip-status">
  {user.vipStatus !== undefined && (<p>VIP : {user.vipStatus ? 'Aktiv' : 'Inaktiv'}</p>)}
  {user.vipPlusStatus !== undefined && (<p>VIP Plus: {user.vipPlusStatus ? 'Aktiv' : 'Inaktiv'}</p>)}
    </div>
      
      <button className="vipinfobtn" onClick={toggleOpenInfo}>VIP information
      <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
    &#9660;
    </span>
      </button>
     
      {isOpen && <Vipinformation />}



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
         {/* <button onClick={() => handleAddCredits(30)} className="shopBtn">
         30 krediter, 64.90 kronor
       </button>
       <button onClick={() => handleAddCredits(60)} className="shopBtn">
         60 krediter, 92.90 kronor
       </button>
       <button onClick={() => handleAddCredits(100)} className="shopBtn">
         100 krediter, 149.90 kronor
       </button>         */}
      </div>

      <div className="promo-code-section">
        <input type="text" placeholder="Ange din kod här" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}/>
        <button className="usecodeBtn" onClick={handlePromoCode}>Använd kod</button>
        {errorMessage && <p>{errorMessage}</p>}
      </div>

     
      <div className="emoji-shop">
  <div className="emoji-shop-list">
    {renderEmojis(emojis)}
  </div>
    </div>
      
    </>);
};
