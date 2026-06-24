// const BASE_URL = "http://ec2-43-201-28-82.ap-northeast-2.compute.amazonaws.com";
const BASE_URL = "http://ec2-13-238-218-82.ap-southeast-2.compute.amazonaws.com:8080";

export async function signup(username, password) {
    const response = await fetch(`${BASE_URL}/api/members/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function login(username, password) {
    const response = await fetch(`${BASE_URL}/api/members/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
} 