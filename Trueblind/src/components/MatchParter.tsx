import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { User } from '../interface/interfaceUser';
import logga from '../img/logga.png';
import { useState } from 'react';

export const MatchList = () => {
  const { user, likedUsers, removeLikedUser } = useUserStore();
  const navigate = useNavigate();

  const backtoaccount = () => {
    navigate('/account');
  };

  const [selectedRange, setSelectedRange] = useState('all');

  const calculateMatch = (likedUser: User) => {
    if (!user) return 0;

    let matchScore = 0;
    const totalCriteria = 7;

    if ((user.interests || "") === (likedUser.interests || "")) matchScore++;
    if (user.smokes === likedUser.smokes) matchScore++;
    if (user.religion === likedUser.religion) matchScore++;
    if (user.wantsChildren === likedUser.wantsChildren) matchScore++;
    if (user.hasChildren === likedUser.hasChildren) matchScore++;
    if (user.education === likedUser.education) matchScore++;
    if (user.relationshipStatus === likedUser.relationshipStatus) matchScore++;

    const matchPercentage = (matchScore / totalCriteria) * 100;
    return Math.round(matchPercentage); 
  };

  const filterUsersByMatch = (likedUser: User) => {
    const matchPercentage = calculateMatch(likedUser);

    switch (selectedRange) {
      case '0-30':
        return matchPercentage >= 0 && matchPercentage <= 30;
      case '30-60':
        return matchPercentage > 30 && matchPercentage <= 60;
      case '60-75':
        return matchPercentage > 60 && matchPercentage <= 75;
      case '75-100':
        return matchPercentage > 75 && matchPercentage <= 100;
      default:
        return true;
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(e.target.value);
  };

  const handleRemoveUser = (id: string | undefined) => {
    if (id) {
      removeLikedUser(id); 
    } else {
      console.error('User ID is undefined');
    }
  };

  return (
    <>
      <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>

      <div className="rowdivbtn">
        <button onClick={backtoaccount}>Tillbaka till kontot</button>
        <button> Meddelanden </button>
      </div>

      <div className="columndiv2">
        <h3>De användare du har gillat:</h3>

        {/* Dropdown  */}
        <label htmlFor="matchRange">Filtrera efter matchning:</label>
        <select id="matchRange" value={selectedRange} onChange={handleRangeChange}>
          <option value="all">Alla</option>
          <option value="0-30">0-30%</option>
          <option value="30-60">30-60%</option>
          <option value="60-75">60-75%</option>
          <option value="75-100">75-100%</option>
        </select>

        <ul>
          {likedUsers.length === 0 ? (
            <p>Du har inte gillat någon ännu.</p>
          ) : (
            likedUsers
              .filter(filterUsersByMatch)
              .map((likedUser) => {
                const matchPercentage = calculateMatch(likedUser);

                return (
                  <li key={likedUser.id}>
                  
                    <h4>{likedUser.firstName}  <button className="deletebtn"onClick={() => handleRemoveUser(likedUser.id)}>
                      X
                    </button></h4>
                    <p>Matchning: {matchPercentage}%</p>
                     <p><strong>Ålder:</strong> {likedUser.age}</p>
                    <p>{likedUser.lifeStatement1}</p>
                    <p>{likedUser.lifeStatement2}</p>
                    {matchPercentage > 75 && (
                      <p>Starta chatt med varandra! <button className="sendmessagebtn">📨 </button></p>
                    )}
                  </li>
                );
              })
          )}
        </ul>
      </div>
    </>
  );
};
