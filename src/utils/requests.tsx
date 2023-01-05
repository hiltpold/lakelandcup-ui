export async function get(url = "") {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });
    return response.json();
}

async function post(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        //redirect: 'follow',
        //referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
    });
    // parses JSON response into native JavaScript objects
    console.log(response.headers);
    return response.json();
}

export default post;
