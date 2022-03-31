import React from 'react'
import { useParams } from "react-router-dom";

function Profile() {
    let { username } = useParams();
    return (
        <>
            <div>
                <h1>Profile</h1>
                <div>
                    <h2>Hello, { username }</h2>
                </div>
            </div>
        </>
    );
}

export default Profile;