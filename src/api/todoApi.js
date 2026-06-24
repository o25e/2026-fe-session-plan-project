// const BASE_URL = "http://ec2-43-201-28-82.ap-northeast-2.compute.amazonaws.com";
const BASE_URL = "http://ec2-13-238-218-82.ap-southeast-2.compute.amazonaws.com:8080";

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

// todo 삭제
export async function removeTodo(memberId, todoId) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos/${todoId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
    }
}

// todo 완료
export async function checkTodo(memberId, todoId) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos/${todoId}/check`, {
        method: "PATCH",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

// todo 리뷰
export async function reviewTodo(memberId, todoId, emoji) {
    const response = await fetch(`${BASE_URL}/api/members/${memberId}/todos/${todoId}/reviews`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emoji,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}