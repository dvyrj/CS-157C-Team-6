import React, { useEffect, useState } from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/apple").then(
      res => res.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    <>
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

export default App;
