import React from 'react'
import { useNavigate } from "react-router-dom";

function Error() {

    let navigate = useNavigate();

    return (
        <>
            <div>
                <h1>Error! Page not found!</h1>
                <div>
                    <button onClick = {() => { navigate("/") }}>Return to Home</button>
                </div>
            </div>
        </>
    );
}

export default Error;