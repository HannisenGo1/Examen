import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { doc, updateDoc, serverTimestamp,getFirestore } from 'firebase/firestore';


import { doSignInWithEmailAndPassword } from './data/UserAuth';
import logga from '../img/logga.png';
import { auth } from './data/firebase';
const db = getFirestore()


//import ForgotPassword from './auth/ForgotPassword';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await doSignInWithEmailAndPassword(email, password);
  
      if (typeof result === 'string') {
        setError(result);
      } else {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            'status.online': true,
            'status.lastLogin': serverTimestamp() 
          });
  
          console.log("Användaren är nu online:", user.email);
        }
  
        navigate('/homepage');
      }
    } catch (error: any) {
      console.error('Fel vid inloggning:', error.message);
      setError('Fel e-post eller lösenord.');
    }
  };
 // <ForgotPassword /> 
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
      </div>
    </>
  );
};
