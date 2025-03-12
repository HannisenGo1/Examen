import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import logga from '../img/logga.png';
import { useState } from 'react';
import { calculateAge } from './DaysCounterVip';
// Här är endast för alla man har gillat och kan se
// sin matchprocent och filtrera genom  filterUsersByMatch!
export const MatchList = () => {
    const { user, likedUsers, removeLikedUser, sendMessageRequest, requests } = useUserStore();
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState('all');
    const backtoaccount = () => {
        navigate('/account');
    };
    const tomessages = () => {
        navigate('/messages');
    };
    const calculateMatch = (likedUser) => {
        if (!user)
            return 0;
        let matchScore = 0;
        const totalCriteria = 7;
        if ((user.interests || "") === (likedUser.interests || ""))
            matchScore++;
        if (user.smokes === likedUser.smokes)
            matchScore++;
        if (user.religion === likedUser.religion)
            matchScore++;
        if (user.wantsChildren === likedUser.wantsChildren)
            matchScore++;
        if (user.hasChildren === likedUser.hasChildren)
            matchScore++;
        if (user.education === likedUser.education)
            matchScore++;
        if (user.relationshipStatus === likedUser.relationshipStatus)
            matchScore++;
        const matchPercentage = (matchScore / totalCriteria) * 100;
        return Math.round(matchPercentage);
    };
    const filterUsersByMatch = (likedUser) => {
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
    const handleRangeChange = (e) => {
        setSelectedRange(e.target.value);
    };
    const handleRemoveUser = (id) => {
        if (id) {
            removeLikedUser(id);
        }
        else {
            console.error('User is undefined');
        }
    };
    const handleSendRequest = (likedUserId) => {
        if (likedUserId) {
            sendMessageRequest(likedUserId);
        }
        else {
            console.error('Liked User is undefined');
        }
    };
    return (<>
    <div className="logga">
    <img src={logga} alt="logo" className="img"/>
    </div>
    
    
    <button className="btnback" onClick={backtoaccount}>
    <i className="fas fa-arrow-left"></i>
    </button>
    
    
    
    <div className="columndiv2">
    <h3>De användare du har gillat:</h3>
    <button className="accountBtn" onClick={tomessages}> Meddelanden </button>
    
    {/* Dropdown */}
    <label htmlFor="matchRange">Filtrera efter matchning:</label>
    <select id="matchRange" value={selectedRange} onChange={handleRangeChange}>
    <option value="all">Alla</option>
    <option value="0-30">0-30%</option>
    <option value="30-60">30-60%</option>
    <option value="60-75">60-75%</option>
    <option value="75-100">75-100%</option>
    </select>
    
    <ul>
    {likedUsers.length === 0 ? (<p>Du har inte gillat någon ännu.</p>) : (likedUsers
            .filter(filterUsersByMatch)
            .map((likedUser) => {
            const matchPercentage = calculateMatch(likedUser);
            const requestStatus = requests.find(request => request.receiverId === likedUser.id);
            return (<li key={likedUser.id}>
          <h4>{likedUser.firstName}  
          <button className="deletebtn" onClick={() => handleRemoveUser(likedUser.id)}>
          X
          </button>
          </h4>  <p><strong>    Är{' '} 
          {likedUser.age?.year && likedUser.age?.month && likedUser.age?.day
                    ? calculateAge(Number(likedUser.age.year), Number(likedUser.age.month), Number(likedUser.age.day))
                    : 'Ej angivet'}
            , år gammal </strong>  </p>
            <p> <strong> {matchPercentage}%  Matchning </strong> </p>
            
            
            
            
            {matchPercentage > 10 && !requestStatus && (<button onClick={() => handleSendRequest(likedUser.id)} className="sendmessagebtn center-button"> Skicka förfrågan 📨 </button>)}
              
              
              {requestStatus && (requestStatus.status === 'pending' ? (<p>Förfrågan skickad, vänta på svar!</p>) : requestStatus.status === 'accepted' ? (<p>Ni är nu matchade! </p>) : null)}
              </li>);
        }))}
        </ul>
        </div>
        </>);
};
