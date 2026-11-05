import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from "../api";


function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify((response.data.user)));

            navigate('/dashboard')
        } catch (error) {
            setError('Invalid username or password');
        }
    }

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}

            <form onSubmit={handleLogin}>

                <label htmlFor="">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />


                <label htmlFor="">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
