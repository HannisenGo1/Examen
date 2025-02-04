import { useEffect } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
// CSS finns i index.css
export const AccountPage = () => {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("Användardata har uppdaterats:", user);
  }, [user]); 
  if (!user) {
    return <div>Inga användardata tillgängliga</div>;
  }

  return (
    <>
      <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>
      <h1 className="Rubriktext"> 
      <span className="firstPart">KO</span>
    <span className="secondPart">NT</span>
    <span className="firstPart">O</span>
      </h1>
      <div className="columndiv">
        <p>{user.firstName}</p>
        <p>Ålder: {user.age}</p>
        <p>Stad: {user.city}</p>
        <p>Kön: {user.gender}</p>
        <p>Sexuell läggning: {user.sexualOrientation}</p>
      </div>
    </>
  );
};
