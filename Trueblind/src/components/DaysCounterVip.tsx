


export const daysRemaining = (expiryDate: number | null | undefined): number => {
    if (!expiryDate) return 0;
    const timeDifference = new Date(expiryDate).getTime() - new Date().getTime();
    return timeDifference > 0 ? Math.floor(timeDifference / (1000 * 3600 * 24)) : 0;
  };
  