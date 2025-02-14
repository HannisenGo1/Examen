import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage'; 
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png';
import nalle1 from '../img/imgProdukter/nalle1.png';
import nalle2 from '../img/imgProdukter/nalle2.png';

export const Shop = () => {
  const navigate = useNavigate();
  
  // Hämta användaren från store eller från localStorage
  const { user, updateUser } = useUserStore(); 

  // Om användaren inte finns, hämta användardata från localStorage
  if (!user) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      updateUser(parsedUser); // Uppdatera store med lagrad data
    }
  }

  if (!user) return <p>Laddar...</p>; // Om ingen användare är inloggad, visa en loading state

  // Se till att user.credits är definierad
  const credits = user.credits || 0;

  // Emoji-data
  const emojis = [
    { name: "nalle1", src: nalle1, price: 3 },
    { name: "nalle2", src: nalle2, price: 3 },
    { name: "bukett", src: bukett, price: 3 },
  ];

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

    // Uppdatera användardatan i store och spara den till localStorage
    const updatedUser = { 
      credits: credits - price,
      purchasedEmojis: updatedEmojis 
    };
    updateUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Spara till localStorage
  };

  // Hantera köp av gratis krediter
  const handleAddCredits = () => {
    const newCredits = credits + 10; // Lägger till 10 gratis krediter
    const updatedUser = { ...user, credits: newCredits };
    updateUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Spara till localStorage
  };

  // Hantera utloggning
  const handleLogout = () => {
    // Ta bort användardata från localStorage
    localStorage.removeItem('user');
    // Uppdatera användaren i store
    updateUser({ credits: 0, purchasedEmojis: [] });
    // Navigera till login-sidan eller någon annan sida
    navigate('/login');
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
        <span className="firstPart">SHO</span>
        <span className="secondPart">PEN</span>
      </h1>

      <p>Kredit: {credits}</p>

      {/* Lägg till gratis krediter */}
      <button onClick={handleAddCredits} className="btn-add-credits">
        Lägg till 10 gratis krediter
      </button>

      {/* Emoji-shop */}
      <div className="emoji-shop">
        <p>Pris: 3 krediter per emoji</p>
        <div className="emoji-picker2">
          {emojis.map((emoji) => (
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

      {/* Visa köpta emojis */}
      <div className="emoji-picker2">
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

      {/* Logga ut knapp */}
      <button onClick={handleLogout} className="btn-logout">Logga ut</button>
    </>
  );
};
