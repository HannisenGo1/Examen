import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage'; 
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png';
import nalle1 from '../img/imgProdukter/nalle1.png';
import nalle2 from '../img/imgProdukter/nalle2.png';
import heart from '../img/imgProdukter/heart.png'

export const Shop = () => {
  const navigate = useNavigate();
  
  const { user, updateUser } = useUserStore(); 

  if (!user) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      updateUser(parsedUser); 
    }
  }

  if (!user) return <p>Laddar...</p>;

  const credits = user.credits || 0;



  const emojis = [
    { name: "nalle1", src: nalle1, price: 3 },
    { name: "nalle2", src: nalle2, price: 3 },
    { name: "bukett", src: bukett, price: 3 },
    { name: "heart", src:heart, price: 1},
  ];

const emojisFor1Credit = emojis.filter((emoji) => emoji.price === 1);
const emojisFor3Credits = emojis.filter((emoji) => emoji.price === 3)


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


    const updatedUser = { 
      credits: credits - price,
      purchasedEmojis: updatedEmojis 
    };
    updateUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); 
  };

  //  köp av gratis krediter
  const handleAddCredits = (amount: number) => {
    const newCredits = credits + amount; 
    const updatedUser = { ...user, credits: newCredits };
    updateUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); 
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
        <span className="firstPart">SHOPEN</span>
       
      </h1>



   {/* Lägg till olika " kreditpaket"  */}
   <div className="emoji-purchased">
      <p > Din kredit: {credits}</p>
      </div> 

   <div className="buybtncontainer"> 
         
<button onClick={() => handleAddCredits(10)} className="shopBtn">
      10 krediter, 22.90 kronor
    </button>
    <button onClick={() => handleAddCredits(30)} className="shopBtn">
     30 krediter, 64.90 kronor
    </button>
    <button onClick={() => handleAddCredits(60)} className="shopBtn">
      60 krediter, 119.90 kronor
    </button>
    <button onClick={() => handleAddCredits(100)} className="shopBtn">
       100 krediter, 189.90 kronor
    </button>
</div> 
    {/* Emoji-shop */}
    <div className="emoji-shop">
  {emojisFor1Credit.length > 0 && (
    <div className="emoji-group">
      <p className="price-text">Pris: 1 kredit per emoji</p>
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

{/* Visa köpta emojis */}
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
