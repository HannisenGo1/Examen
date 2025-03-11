import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { doc, updateDoc, serverTimestamp,getFirestore } from 'firebase/firestore';
import ForgotPassword from './Forgotpassword';

import { doSignInWithEmailAndPassword } from './data/UserAuth';
import logga from '../img/logga.png';
import { auth } from './data/firebase';
const db = getFirestore()


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); 

  const navigate = useNavigate(); 


const openForgot = () => {
  setIsForgotPassword(true)
}

// spelar ingen roll om användaren har en liten eller stor bokstav i sin mejl.
// om registrerad med HANNa_kArlsson@gmail.com
// så ska det funka även om dom skriver hanna.karlsson@gmail.com eller HANNA.Karlsson@gmail.com
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await doSignInWithEmailAndPassword(email.toLowerCase(), password);

    if (typeof result === 'string') {
      setError(result); 
      return;
    }

    const user = auth.currentUser;
    
    if (user) {
      if (!user.emailVerified) {
        setError("Verifiera din email innan du loggar in. ");
        return;
      }
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        'status.online': true,
        'status.lastLogin': serverTimestamp()
      });

  
      navigate('/homepage');
    } else {
      setError('Användaren kunde inte hittas.');
    }
  } catch (error: any) {
    console.error('Fel vid inloggning:', error.message);
    if (error.code === 'auth/wrong-password') {
      setError('Felaktigt lösenord.');
    } else if (error.code === 'auth/user-not-found') {
      setError('Ingen användare med det e-postadressen.');
    } else {
      setError('Något gick fel vid inloggning.');
    }
  }
};

  return (
    <> 
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>
      <h2 className="login-header">Logga in</h2>   
      <div className="login-container">
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         
          <button type="submit" className="login-button">Logga in</button>


    
        </form>
        {error && <p className="login-error"> Fel vid inloggning</p>}
        <button className="justtextbtn" onClick={openForgot}>Glömt lösenord</button>
     {isForgotPassword && <ForgotPassword />}

      </div>
    </>
  );
};
