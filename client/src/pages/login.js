import React from 'react'
import '../styles/login.css'

// Login
function Login() {
    return (
        <>
            <html className='login_js'>
            <body>
                <div className='login_box'>
                    <form className='login_form' action="http://localhost:3001/loginAccount" method="GET">
                        <h1>Login</h1>
                        <div className='email'><label> <input className='login_input' type="text" name="email" placeholder="Email"/> </label></div>
                        <div className='password'><label> <input className='password_input' type="text" name="password" placeholder="Password" /> </label></div>
                        <input className='submit_input' type="submit" value="Submit"/>
                    </form>
                </div>
            </body>
            </html>
        </>
    );
}

export default Login;