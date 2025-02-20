import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';
import ForgotPassword from './auth/ForgotPassword';
import { doSignInWithEmailAndPassword } from './data/UserAuth';


export const Login= () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]); 
  const navigate = useNavigate(); 

  const getUserStorageKey = (userId: string, key: string) => `${key}-${userId}`;

  useEffect(() => {
    const user = useUserStore.getState().user;
    if (user) {
      useUserStore.getState().loadChatsFromStorage();
      useUserStore.getState().loadRequestsFromStorage();
      useUserStore.getState().loadUserFromStorage(); 
      useUserStore.getState().loadDeniedUsersFromStorage();
    }
  }, []);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
          throw new Error(`HTTP error! ${response.status}`);
        }

        const userData = await response.json();
        setUsers(userData); 
        useUserStore.getState().setUser(userData);
        console.log('Hämtade användare:', userData);

      } catch (error) {
        console.error('Fel vid hämtning av användare:', error);
        setError('Kunde inte hämta användardata.');
      }
    };

    fetchUsers();
  }, []); 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const userData = await doSignInWithEmailAndPassword(email, password);

        console.log(" Inloggad som:", userData);

        const userId = userData.uid;
        const storedVIPStatus = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'vipStatus')) || 'false');
        const storedVIPExpiryString = localStorage.getItem(getUserStorageKey(userId, 'vipExpiry'));
        const storedVIPExpiry = storedVIPExpiryString ? Number(storedVIPExpiryString) : null;

        const updatedUser = {
            ...userData, 
            vipStatus: storedVIPStatus,
            vipExpiry: storedVIPExpiry,
        };
        useUserStore.getState().setUser(userData); 

        useUserStore.getState().setUser(updatedUser);
        useUserStore.getState().loadRequestsFromStorage();
        useUserStore.getState().loadChatsFromStorage();

        setError('');
        navigate('/homepage'); 
    } catch (error) {
        console.error('❌ Fel vid inloggning:', error);
        setError('Fel e-post eller lösenord.');
    }
};

  return (
    <> 
      <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>
      <h2 className="login-header">Logga in</h2>   
      <div className="login-container">

   
        <form className="form-login"onSubmit={handleSubmit}>
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
          <ForgotPassword  /> 
          <button type="submit" className="login-button">Logga in</button>
        </form>
  
        {error && <p className="login-error">{error}</p>}
      </div>
    </>
  );
  
};
