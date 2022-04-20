import React from 'react'

function Register() {
    return (
        <>
            <div>
                <h1>Register</h1>
            </div>
            <form action="http://localhost:3001/registerAccount" method="GET">
                <div><label> Email: <input type="text" name="email" /> </label></div>
                <div><label> Password: <input type="text" name="password" /> </label></div>
                <div><label> First Name: <input type="text" name="first" /> </label></div>
                <div><label> Last Name: <input type="text" name="last" /> </label></div>
                <div>
                <label for="type">Account Type:</label>
                    <select name="type" id="type">
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </>
    );
}

export default Register;