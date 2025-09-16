import React , { useState } from 'react';

function Auth({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        const res = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })  // corregido nombre username
        }); 

        const data = await res.json();
        alert(data.message);
    }

    const login = async () => {
        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (data.token) setToken(data.token);
        else alert(data.message);
    }

    return(
        <div style={{ maxWidth: 350, margin: "50px auto" }}>
            <h2>Registro y login</h2>
            <input 
                placeholder='Usuario' 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
            />
            <input 
                placeholder='Contraseña' 
                type='password' 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
            <button onClick={register}>Registrar</button>
            <button onClick={login}>Login</button>
        </div>
    );
}

export default Auth;