import logga from '../img/logga.png';
import { useNavigate} from 'react-router-dom';
import bild from '../img/bild.png'


export const Afterlogin = () => {
const navigate = useNavigate()

const handleToPartner = () => (navigate('/Findpartner'))
const handleToAccount = () => (navigate ('/account'))



return (
<>
<div className="logga">
      <img src={logga} alt="picture" className="img" />
    </div>
     <div className="divForchoices"> 
  <button onClick={handleToPartner}
  className='accountBtn'> 
   Hitta din partner
    </button> 
    <button onClick={handleToAccount}
    className='accountBtn'> 
  Konto
   </button> 
</div>

<div className="frontpagetextDiv"> 
<h2 className="welcometexttopage"> 
Letar du efter kärlek, vänskap eller en livspartner? 
Vår plattform gör det enkelt att hitta någon som passar just dig. Med smart matchning, 
Börja din resa idag och hitta den du söker! 
</h2>
    </div> 
    <div className="logga2">
      <img src={bild} alt="bild" className="img2" />
    </div>
</>
    )

}