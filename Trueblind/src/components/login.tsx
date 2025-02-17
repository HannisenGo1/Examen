import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUserStore } from '../storage/storage';
import logga from '../img/logga.png';



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
        console.log('Hämtade användare:', userData);

      } catch (error) {
        console.error('Fel vid hämtning av användare:', error);
        setError('Kunde inte hämta användardata.');
      }
    };

    fetchUsers();
  }, []); 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const foundUser = users.find(user => user.email === email && user.password === password);
  
    if (foundUser) {
      console.log('Inloggad:', foundUser);
  
      const userId = foundUser.id;
  
      const storedVIPStatus = JSON.parse(localStorage.getItem(getUserStorageKey(userId, 'vipStatus')) || 'false');
      const storedVIPExpiryString = localStorage.getItem(getUserStorageKey(userId, 'vipExpiry'));
      const storedVIPExpiry = storedVIPExpiryString ? Number(storedVIPExpiryString) : null;
  
      const updatedUser = {
        ...foundUser,
        vipStatus: storedVIPStatus,
        vipExpiry: storedVIPExpiry,
      };
  
      useUserStore.getState().setUser(updatedUser);
      useUserStore.getState().loadRequestsFromStorage();
      useUserStore.getState().loadChatsFromStorage();
  
      setError('');
      navigate('/homepage');
    } else {
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
          <button className="justtextbtn">Glömt lösenord</button>
          <button type="submit" className="login-button">Logga in</button>
        </form>
  
        {error && <p className="login-error">{error}</p>}
      </div>
    </>
  );
  
};
