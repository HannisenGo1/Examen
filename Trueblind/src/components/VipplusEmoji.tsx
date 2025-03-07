import { useState } from 'react';
import { useUserStore } from '../storage/storage';
import heart2 from '../img/imgProdukter/heart2.png';

interface VipPlusEmojisProps {
  chatRoomId?: string;
  sendEmoji: (emojiHtml: string) => Promise<void>;
}

const VipPlusEmojis = ({ chatRoomId, sendEmoji }: VipPlusEmojisProps) => {
  const [showEmojis, setShowEmojis] = useState(false); 
  const { user } = useUserStore();
  const vipPlusStatus = user?.vipPlusStatus ?? false;

  const handleVipPlusEmojiClick = async (emojiName: string) => {
    if (!chatRoomId || !user?.id) {
      console.error('chatRoomId eller user saknas!');
      return;
    }
    await sendEmoji(`<img src="${emojiName}" alt="emoji" class="sent-emoji"/>`);
  };

  if (!vipPlusStatus) return null;

  return (
    <div className="emoji-picker">
      <button onClick={() => setShowEmojis(!showEmojis)} className="emoji-btn">
        Vip emojis
      </button>

      {showEmojis && (
        <div className="emoji-picker">
          <div className="emoji-item" onClick={() => handleVipPlusEmojiClick(heart2)}>
            <img src={heart2} alt="heart2" className="emoji-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VipPlusEmojis;
