import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from "../api";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "../components/ui/field"
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


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
        <div className="flex items-center justify-center py-20 bg-[#9a0002] h-screen">
            <section className="m-auto w-100 bg-[#efe6dd] p-8 rounded-xs">
            
            <img src="/public/Sidebar_logo.svg" alt="" />

            <form onSubmit={handleLogin}>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Username</FieldLabel>
                            <Input type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required className="border border-gray-300"/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required className="border border-gray-300"/>
                        </Field>
                    </FieldGroup>
                    {error && <p className="text-red-600 font-semibold">{error}</p>}
                    <Button type="submit" className="bg-[#e5b85c] hover:bg-[#e5b85c]/80 text-[#161111] cursor-pointer font-bold">Login</Button>
                </FieldSet>
            </form>
            </section>
        </div>
    )
}

export default Login
