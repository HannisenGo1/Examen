


export const daysRemaining = (expiryDate: number | null | undefined): number => {
    if (!expiryDate) return 0;
    const timeDifference = new Date(expiryDate).getTime() - new Date().getTime();
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
