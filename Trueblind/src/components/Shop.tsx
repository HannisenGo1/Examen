import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../storage/storage'; 
import logga from '../img/logga.png';
import bukett from '../img/imgProdukter/bukett.png';
import nalle1 from '../img/imgProdukter/nalle1.png';
import nalle2 from '../img/imgProdukter/nalle2.png';

export const Shop = () => {
  const navigate = useNavigate();
  const { credits, purchasedEmojis, purchaseEmoji, addCredits } = useUserStore();
console.log('köpt emoji', purchasedEmojis)
  const handleToAccount = () => navigate('/account');

  return (
    <>
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>
      <button onClick={handleToAccount} className="btnback">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h1 className="Rubriktext">
        <span className="firstPart">SHO</span>
        <span className="secondPart">PEN</span>
      </h1>

      <p>Kredit: {credits}</p>

      <div className="emoji-picker2">
        <img src={nalle1} alt="nalle1" className="emoji" onClick={() => purchaseEmoji("nalle1", 3)} />
        <img src={nalle2} alt="nalle2" className="emoji" onClick={() => purchaseEmoji("nalle2", 3)} />
        <img src={bukett} alt="bukett" className="emoji" onClick={() => purchaseEmoji("bukett", 3)} />
      </div>

      <div className="credit-options">
        <button onClick={() => addCredits(10)}>Köp 10 krediter</button>
        <button onClick={() => addCredits(20)}>Köp 20 krediter</button>
        <button onClick={() => addCredits(50)}>Köp 50 krediter</button>
        <button onClick={() => addCredits(100)}>Köp 100 krediter</button>
      </div>

      <div>
        <p>Du har köpt:</p>
        {purchasedEmojis.map((emoji) => (
          <p key={emoji.emoji}>
            {emoji.emoji}: {emoji.count}
          </p>
        ))}
      </div>
    </>
  );
};
