import { User } from '../interface/interfaceUser';
import { daysRemaining } from './DaysCounterVip';
export const isVIPExpired = (expiryDate: number | null | undefined): boolean => {
  if (!expiryDate) return true;
  return new Date().getTime() > new Date(expiryDate).getTime();
};

interface VipUserProps {
  user: User;
  onVIPPurchase: () => void;
  onVIPPlusPurchase: () => void;
}

export const VipUser = ({ user, onVIPPurchase, onVIPPlusPurchase }: VipUserProps) => {
  const vipDaysLeft = daysRemaining(user.vipExpiry);
  const vipPlusDaysLeft = daysRemaining(user.vipPlusExpiry);

  const hasActiveVipPlus = user.vipPlusStatus && !isVIPExpired(user.vipPlusExpiry);
  const hasActiveVip = user.vipStatus && !isVIPExpired(user.vipExpiry);

  return (
    <div className="VIP-purchased">
      {hasActiveVipPlus ? (
        <p>Du har <strong>VIP Plus</strong>. {vipPlusDaysLeft > 0 ? `Det är ${vipPlusDaysLeft} dagar kvar på din VIP Plus.` : ''}</p>
      ) : hasActiveVip ? (
        <p>Du har <strong>VIP</strong>. {vipDaysLeft > 0 ? `Det är ${vipDaysLeft} dagar kvar på din VIP.` : ''}</p>
      ) : (
        <p>Du har ingen aktiv VIP-status.</p>
      )}

      {!hasActiveVipPlus && (
        <button onClick={onVIPPlusPurchase} className="shopBtn">
          Uppgradera till VIP Plus för 189.90 kronor (30 dagar) + Få 20 krediter
        </button>
      )}

      {!hasActiveVip && (
        <button onClick={onVIPPurchase} className="shopBtn">
          Köp VIP för 119.90 kronor (30 dagar) + Få 20 krediter
        </button>
      )}
    </div>
  );
};
