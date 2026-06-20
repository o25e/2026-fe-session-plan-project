const BASE_URL = "http://ec2-43-201-28-82.ap-northeast-2.compute.amazonaws.com";

// 전체 todo 리스트 조회
export async function getTodos(memberId) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos`);
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

// todo 추가
export async function createTodo(memberId, date, content) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date,
            content,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

// todo 수정
export async function updateTodo(memberId, todoId, date, content) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos/${todoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date,
            content,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}