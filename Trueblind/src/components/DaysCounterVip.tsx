


export const daysRemaining = (expiryDate: number | null | undefined): number => {
  if (expiryDate === null || expiryDate === undefined) return 0;
  const timeDifference = expiryDate - Date.now();
  return timeDifference > 0 ? Math.floor(timeDifference / (1000 * 3600 * 24)) : 0;
};
  
 export const calculateAge = (year: number, month: number, day: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
  
    if (
      today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--; 
    }
  
    return age;
  };
//  antalet dagar kvar på vip 
export const getDaysLeft = (expiryTimestamp: number | null): number => {
  if (expiryTimestamp === null || expiryTimestamp === undefined) return 0; 

  const now = Date.now();
  const diff = expiryTimestamp - now;
  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24)); 

  return daysLeft;
};

