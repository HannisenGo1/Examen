import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './data/firebase';
export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handlePasswordReset = async () => {
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent!');
        }
        catch (error) {
            console.error('Password reset failed:', error);
            setMessage('Failed to send reset email. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="forgotpassworddiv">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Skriv in din mejl "/>
      <button className="btnreset" onClick={handlePasswordReset} disabled={loading}>
        {loading ? 'Sending...' : 'Reset Password'}
      </button>
      {message && <p>{message}</p>}
    </div>);
};
export default ForgotPassword;
