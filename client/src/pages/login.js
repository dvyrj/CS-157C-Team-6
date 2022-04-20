import React from 'react'

function Login() {
    return (
        <>
            <div>
                <h1>Login</h1>
            </div>
            <form action="http://localhost:3001/loginAccount" method="GET">
                <div><label> Email: <input type="text" name="email" /> </label></div>
                <div><label> Password: <input type="text" name="password" /> </label></div>
                <input type="submit" value="Submit" />
            </form>
        </>
    );
}

export default Login;