import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { User } from '../interface/interfaceUser';

export const MatchList = () => {
  const { user, likedUsers } = useUserStore();
  const navigate = useNavigate();

  const backtoaccount = () => {
    navigate('/account');
  };

  console.log("Liked Users in MatchList:", likedUsers);

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
    return matchPercentage;
  };

  return (
    <div>
      <button onClick={backtoaccount}>Tillbaka till kontot</button>

      <h3>De användare du har gillat:</h3>
      <ul>
        {likedUsers.length === 0 ? (
          <p>Du har inte gillat någon ännu.</p>
        ) : (
          likedUsers.map((likedUser) => {
            const matchPercentage = calculateMatch(likedUser);

            return (
              <li key={likedUser.id}>
                <img src={likedUser.photo || "/defaultProfilePicture.png"} alt={`${likedUser.firstName}'s profile`} />
                <h4>{likedUser.firstName}</h4>
                <p>Matchprocent: {matchPercentage.toFixed(2)}%</p>
                <p><strong>Kön:</strong> {likedUser.gender}</p>
                <p><strong>Religion:</strong> {likedUser.religion}</p>
                <p>{likedUser.lifeStatement1}</p>
                <p>{likedUser.lifeStatement2}</p>
                {matchPercentage > 75 && (
                  <p>Starta chatt med varandra! 📨</p>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
