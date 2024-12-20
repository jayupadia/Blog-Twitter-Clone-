import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import './style/VerifyOtp.css';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email] = useState(location.state?.email || '');
    const [name] = useState(location.state?.name || '');
    const [password] = useState(location.state?.password || '');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [endTime] = useState(Date.now() + 120000); // Set the countdown end time once

    // Redirect to registration if email, name, or password is missing
    useEffect(() => {
        if (!email || !name || !password) {
            navigate('/Signup'); // Redirect to register page
        }
    }, [email, name, password, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, name, password }),
            });

            const data = await response.json();
            setMessage(data.message);

            // Check if verification was successful and redirect to login
            if (response.ok && data.redirect) {
                alert("Your credentials have been sent to your email.");
                navigate('/login');
            }
        } catch (error) {
            setMessage('Error verifying OTP');
        }
    };

    const renderer = ({ minutes, seconds }) => (
        <div className="countdown">
            <span>{String(minutes).padStart(2, '0')}:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
        </div>
    );

    const handleMouseMove = (e) => {
        const background = document.getElementById('background');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        background.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #333, #222, #111)`;
    };

    useEffect(() => {
        document.getElementById('background').addEventListener('mousemove', handleMouseMove);
        return () => document.getElementById('background').removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div id="background" className="flex items-center justify-center min-h-screen relative overflow-hidden verify-otp-container">
            <h2>Verify OTP</h2>
            <div className="timer">
                <Countdown 
                    date={endTime} // Static countdown end time
                    renderer={renderer} 
                    onComplete={() => setMessage(<p className='Time-Up'>Time is up!</p>)} 
                />
            </div>
            <form onSubmit={handleSubmit} className="verify-otp-form">
                <input
                    type="number"
                    className="OTP"
                    id="otpInput"
                    placeholder="OTP"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit">Verify OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOtp;
