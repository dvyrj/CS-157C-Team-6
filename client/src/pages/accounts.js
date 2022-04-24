
// Admin: Display all users
import React, { useEffect, useState } from 'react';
import '../styles/accounts.css'

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
                <div className='account_box'>
                    <h1 className='account_title'>Accounts</h1>
                    <table className='account_table'>
                        <tr>
                            <th className='account_id_th'>Account ID</th>
                            <th className='first_name_th'>First Name</th>
                            <th className='last_name_th'>Last Name</th>
                            <th className='account_type_th'>Account Type</th>
                            <th className='email_th'>Email</th>
                            <th className='password_th'>Password</th>
                            <th className='member_since_th'>Member Since</th>
                        </tr>
                        {
                            (typeof backendData.data === 'undefined') ? 
                            ( <p>Loading...</p> ) : (  backendData.data.map(
                                (data, i) => (
                                    <tr key={i}>
                                        <td className='account_id_td'>{data.account_id}</td>
                                        <td className='first_name_td'>{data.first_name}</td>
                                        <td className='last_name_td'>{data.last_name}</td>
                                        <td className='account_type_td'>{data.account_type}</td>
                                        <td className='email_td'>{data.email}</td>
                                        <td className='password_td'>{data.password}</td>
                                        <td className='member_since_td'>{data.date_added}</td>
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