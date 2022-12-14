async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      //redirect: 'follow', 
      //referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    // parses JSON response into native JavaScript objects
    return response.json(); 
}

export default postData;
  