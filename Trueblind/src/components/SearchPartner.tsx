import { SearchPartners } from './AccountFindParter';
import logga from '../img/logga.png';
import { useNavigate } from 'react-router-dom';
export const SearchHere = () => {

const navigate = useNavigate()

const backTochoices = () => (
    navigate("/homepage")
)
    return (
<> 
<div className="logga">
      <img src={logga} alt="picture" className="img" />
    </div>
    <button className="btnback" onClick={backTochoices}> 
     <i className="fas fa-arrow-left"></i>
  </button> 

<h2 className="confirmation-message">
Vilken partner söker du? 

</h2>
<SearchPartners/> 
</>

    )
}

