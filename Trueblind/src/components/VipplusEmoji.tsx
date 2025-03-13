import { useState } from 'react';
import { useUserStore } from '../storage/storage';
import heart2 from '../img/imgProdukter/heart2.png';
import vipblomma1 from '../img/imgProdukter/vipblomma1.png';
import vipblomma2 from '../img/imgProdukter/vipblomma2.png';
// import vipnalle from '../img/imgProdukter/vipnalle.png';
// { name: 'vipnalle', src: vipnalle, className: 'small-emoji' },

interface VipPlusEmojisProps {
  chatRoomId?: string;
  sendEmoji: (emojiHtml: string) => Promise<void>;
}

const VipPlusEmojis = ({ chatRoomId, sendEmoji }: VipPlusEmojisProps) => {
  const [showEmojis, setShowEmojis] = useState(false); 
  const { user } = useUserStore();
  const vipPlusStatus = user?.vipPlusStatus ?? false;
  
  const emojis = [
    { name: 'heart2', src: heart2, className: '' },
    { name: 'vipblomma1', src: vipblomma1, className: 'small-emoji' }, 
    { name: 'vipblomma2', src: vipblomma2, className: 'small-emoji' },
   
  ];
  
  const handleVipPlusEmojiClick = async (emojiSrc: string) => {
    if (!chatRoomId || !user?.id) {
      console.error('chatRoomId eller user saknas!');
      return;
    }
    try {
      await sendEmoji(`<img src="${emojiSrc}" alt="emoji" class="sent-emoji"/>`);
    } catch (error) {
      console.error('Misslyckades att skicka emoji:', error);
    }
  };
  
  if (!vipPlusStatus) return null;
  
  return (
    <div className="emoji-picker">
    <button onClick={() => setShowEmojis((prev) => !prev)} className="emoji-btn">
    VIP emojis
    </button>
    
    {showEmojis && (
      <div className="emoji-list">
      {emojis.map((emoji) => (
        <button
        key={emoji.name}
        onClick={() => handleVipPlusEmojiClick(emoji.src)}
        className={`emoji-item ${emoji.className}`}
        >
        <img src={emoji.src} alt={emoji.name} className="emoji-img" />
        </button>
      ))}
      </div>
    )}
    </div>
  );
};

export default VipPlusEmojis;
