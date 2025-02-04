import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUserStore } from '../storage/storage';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]); 
  const navigate = useNavigate(); 


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
      useUserStore.getState().setUser(foundUser);
      console.log('Inloggad:', foundUser);
      setError('');
      navigate('/account');
    
    } else {
      setError('Fel e-post eller lösenord.');
    }
  };

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-post</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Logga in</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
