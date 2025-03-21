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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');  

  try {
    const result = await doSignInWithEmailAndPassword(email.toLowerCase(), password);
    const user = auth.currentUser;

    if (user) {
      if (!user.emailVerified) {
        setError('Verifiera din e-postadress innan du loggar in.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        'status.online': true,
        'status.lastLogin': serverTimestamp(),
      });

      navigate('/homepage');
    }
  } catch (error: any) {
    console.error('Fel vid inloggning:', error);
console.log(error.code); 


    // Alla olika felkoder vid inloggning från Firebase auth.
    switch (error.code) {
      case 'auth/wrong-password':
        setError('Fel lösenord. Försök igen.');
        break;
      case 'auth/user-not-found':
        setError('Ingen användare med denna e-postadress.');
        break;
      case 'auth/invalid-email':
        setError('Ogiltig e-postadress.');
        break;
      case 'auth/too-many-requests':
        setError('För många försök. Vänta en stund och försök igen.');
        break;
      case 'auth/user-disabled':
        setError('Detta konto har inaktiverats.');
        break;
      case 'auth/email-already-in-use':
        setError('Denna e-postadress används redan.');
        break;
        case'auth/invalid-credential':
        setError('Felaktig Email eller lösenord')
        break;
      default:
        setError('Ett oväntat fel uppstod. Försök igen senare...');
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
        {error && <p className="login-error">{error}</p>}

        <button className="justtextbtn" onClick={openForgot}>Glömt lösenord</button>
     {isForgotPassword && <ForgotPassword />}

      </div>
    </>
  );
};
