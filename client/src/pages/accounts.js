
// Admin: Display all users
import React, { useEffect, useState } from 'react';
import '../styles/styles.css'

function Accounts() {
    const [backendData, setBackendData] = useState([{}]);

    useEffect(() => {
        fetch("/getAccounts").then(
            res => res.json()
        ).then(
            data => {
                setBackendData(data);
            }
        )
    }, []);

    return (
        <>
            <html className='account_js'>
                <h1>Accounts</h1>
                <div>
                    <table>
                        <tr>
                            <th>Account ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Account Type</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Member Since</th>
                        </tr>
                        {
                            (typeof backendData.data === 'undefined') ? 
                            ( <p>Loading...</p> ) : (  backendData.data.map(
                                (data, i) => (
                                    <tr key={i}>
                                        <td>{data.account_id}</td>
                                        <td>{data.first_name}</td>
                                        <td>{data.last_name}</td>
                                        <td>{data.account_type}</td>
                                        <td>{data.email}</td>
                                        <td>{data.password}</td>
                                        <td>{data.date_added}</td>
                                    </tr>)
                                )
                            )
                        }
                    </table>
                </div>
            </html>
        </>
    );
}

export default Accounts;