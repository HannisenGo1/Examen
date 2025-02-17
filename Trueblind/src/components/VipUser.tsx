import { User } from '../interface/interfaceUser';


export const isVIPExpired = (user: User): boolean => {
  if (!user.vipExpiry || new Date().getTime() > new Date(user.vipExpiry).getTime()) {
    return true; 
  }
  return false;
};

interface VipUserProps {
  user: User;
  onVIPPurchase: () => void;
}


export const VipUser = ({ user, onVIPPurchase }: VipUserProps) => {

  
  const daysRemaining = () => {
    if (!user.vipExpiry) return 0;
    const expiryDate = new Date(user.vipExpiry);
    const currentDate = new Date();
    const timeDifference = expiryDate.getTime() - currentDate.getTime();
    return timeDifference > 0 ? Math.floor(timeDifference / (1000 * 3600 * 24)) : 0;
  };


  return (
    <div className="emoji-purchased">
      {isVIPExpired(user) ? (
        <p>VIP har gått ut.</p>
      ) : (
        <p>Du har VIP-status. {daysRemaining() > 0 ? `Det är ${daysRemaining()} dagar kvar på din VIP.` : ''}</p>
      )}

      {isVIPExpired(user) && (
        <button onClick={onVIPPurchase} className="shopBtn">
          Köp VIP för 189.90 kronor (30 dagar) + Få 30 krediter
        </button>
      )}

      <p>VIP går endast att köpa en gång i månaden!</p>
    </div>
  );
};
