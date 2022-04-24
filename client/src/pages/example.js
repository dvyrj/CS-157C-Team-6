import React, { useEffect, useState } from 'react';
import '../styles/styles.css'

function Example() {
    const [backendData, setBackendData] = useState([{}]);

    useEffect(() => {
        fetch("/getAccounts").then(
            res => res.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    }, []);

    return (
        <>
            <h1>Cassandra Example</h1>
            <div>
            {
                (typeof backendData.first_name === 'undefined') ? 
                ( <p>Loading...</p> ) : (  backendData.first_name.map((first_name, i) => (<p key={i}>{first_name}</p>)) )
            }
            </div>
            <br></br>
            <div>
            {
                (typeof backendData.last_name === 'undefined') ? 
                ( <p>Loading...</p> ) : (  backendData.last_name.map((last_name, i) => (<p key={i}>{last_name}</p>)) )
            }
            </div>
        </>
    );
}

export default Example;