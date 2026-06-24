import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "../components/Calendar";
import { getTodos, createTodo, updateTodo, removeTodo, checkTodo, reviewTodo } from "../api/todoApi";

function Main() {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [username] = useState(() => localStorage.getItem("username"));

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const [reviewTodoId, setReviewTodoId] = useState(null);
    const reviewPickerRef = useRef(null); // 외부 클릭 감지용 (리뷰 이모지 영역)
    const emojiList = ["❤️", "👍", "🔥", "✅", "😍", "😢", "😋", "🤮", "👽", "💩"];

    // Date → YYYY-MM-DD (프론트 비교용 포맷)
    const formDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatDateTime = (date) => `${formDate(date)}T00:00:00`;

    const formatTitleDate = (date) => {
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 서버에서 todo 전체 조회 후 프론트에서 사용 가능한 형태로 변환
    const loadTodos = async () => {
        try{
            const memberId = localStorage.getItem("memberId");
            if (!memberId) return;
            const data = await getTodos(memberId);

            const formattedTodos = data.map((todo) => ({
                id: todo.todo_id,
                text: todo.content,
                completed: todo.is_checked,
                emoji: todo.emoji ?? todo.review ?? todo.review_emoji ?? todo.reviewEmoji ?? "",
                date: todo.date.split("T")[0], // ISO → YYYY-MM-DD (날짜 필터링용)
            }));

            setTodos(formattedTodos);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (!username) {
            navigate("/");
            return;
        }

        loadTodos();
    }, [username, navigate]);

    // 리뷰 창이 열려 있을 때만 외부 클릭 시 자동 닫힘
    useEffect(() => {
        if (!reviewTodoId) return;

        const closeReviewPicker = (event) => {
            if (reviewPickerRef.current?.contains(event.target)) return;
            setReviewTodoId(null);
        };

        document.addEventListener("mousedown", closeReviewPicker);
        return () => document.removeEventListener("mousedown", closeReviewPicker);
    }, [reviewTodoId]);

    // 선택 날짜 기준으로 todo 생성
    const addTodo = async () => {
        if (!input.trim()) return;

        try {
            const memberId = localStorage.getItem("memberId");

            const newTodo = await createTodo(
                memberId,
                formatDateTime(selectedDate),
                input
            );

            setTodos((prevTodos) => [
                ...prevTodos,
                {
                    id: newTodo.todo_id,
                    text: newTodo.content,
                    completed: newTodo.is_checked,
                    emoji: newTodo.emoji ?? "",
                    date: newTodo.date.split("T")[0],
                },
            ]);

            setInput("");
        } catch (error) {
            alert(error.message);
        }
    };

    // 완료 상태 토글 (서버 상태 변경 후 전체 동기화)
    const toggleComplete = async (id) => {
        try {
            const memberId = localStorage.getItem("memberId");

            await checkTodo(memberId, id);
            await loadTodos();
        } catch (error) {
            alert(error.message);
        }
    };

    // todo 삭제 후 목록 갱신
    const deleteTodo = async (id) => {
        try {
            const memberId = localStorage.getItem("memberId");

            await removeTodo(memberId, id);
            await loadTodos();
        } catch (error) {
            alert(error.message);
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    }

    // 수정 완료 후 서버 반영 + 목록 동기화
    const saveEdit = async (id) => {
        try {
            const memberId = localStorage.getItem("memberId");

            await updateTodo(
                memberId,
                id,
                formatDateTime(selectedDate),
                editText
            );

            await loadTodos();

            setEditingId(null);
            setEditText("");
        } catch (error) {
            alert(error.message);
        }
    };

    // todo에 이모지 리뷰 저장 후 UI 즉시 반영
    const reviewTodoHandler = async (id, emoji) => {
    try {
        const memberId = localStorage.getItem("memberId");

        await reviewTodo(memberId, id, emoji);

        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, emoji } : todo
            )
        );

        setReviewTodoId(null); // UI 닫기
    } catch (error) {
        alert(error.message);
    }
};

    // 선택된 날짜 기준 필터링
    const todaysTodos = todos.filter((todo) => todo.date === formDate(selectedDate));
    const completedCount = todaysTodos.filter((todo) => todo.completed).length;

    // 완료된 항목을 아래로 정렬
    const sortedTodos = [...todaysTodos].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    const handleLogout = () => {
        localStorage.removeItem("memberId");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-12">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-6 flex items-center justify-start gap-2">
                    <div className="rounded-lg bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        <span className="text-orange-500">{username}</span>님
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600"
                    >
                        로그아웃
                    </button>
                </div>

                {/* 헤더 */}
                <div className="mb-10 text-center">
                    <h1 className="mt-4 text-5xl font-extrabold text-orange-500">
                        To Do
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        ~오늘의 계획~<br></br>일단 시작하기
                    </p>
                </div>

                {/* 달력 + 할 일 목록 */}
                <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
                    <div className="rounded-4xl bg-white p-6 shadow-md lg:sticky lg:top-8">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            todos={todos}
                        />
                    </div>

                    <div className="rounded-4xl bg-white p-8 shadow-md lg:self-start">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 text-left">
                                    {formatTitleDate(selectedDate)}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 text-left">
                                    선택한 날짜의 할 일 목록입니다.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
                                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-orange-700">
                                        전체
                                    </span>
                                    <span className="text-xl font-bold">
                                        {todaysTodos.length}
                                    </span>
                                </div>
                                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-sm">
                                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                        완료
                                    </span>
                                    <span className="text-xl font-bold">
                                        {completedCount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 입력창 */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="할 일을 입력하세요"
                                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none shadow-sm transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />

                            <button
                                onClick={addTodo}
                                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={!input.trim()}
                            >
                                추가
                            </button>
                        </div>

                        {/* 할 일 목록 */}
                        <div className="space-y-4">
                            {todaysTodos.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-slate-200 bg-orange-50 px-6 py-10 text-center text-slate-500">
                                    오늘 등록된 일정이 없습니다.
                                </div>
                            ) : (
                                sortedTodos.map((todo) => (
                                    <div key={todo.id}>
                                        <div className="rounded-3xl border border-slate-200 bg-orange-50 p-4 shadow-sm">
                                            <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() =>
                                                        toggleComplete(todo.id)
                                                    }
                                                />

                                                {editingId === todo.id ? (
                                                    <input
                                                        type="text"
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        onBlur={() => saveEdit(todo.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                saveEdit(todo.id);
                                                            }
                                                        }}
                                                        autoFocus
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-sm ${
                                                                todo.completed
                                                                    ? "line-through text-slate-400"
                                                                    : "text-slate-900"
                                                            }`}
                                                        >
                                                            {todo.text}
                                                        </span>
                                                        {todo.emoji && (
                                                            <span className="text-base leading-none">
                                                                {todo.emoji}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setReviewTodoId((currentId) => currentId === todo.id ? null : todo.id)}
                                                    className="rounded-2xl bg-white px-3 py-2 text-sm transition text-green-500
                                                            hover:bg-green-50 hover:text-green-600"
                                                >
                                                    🐸
                                                </button>
                                                <button
                                                onClick={() => startEdit(todo)}
                                                className="rounded-2xl bg-white px-3 py-2 text-sm transition text-blue-500
                                                            hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                ✏️
                                                </button>
                                                <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="rounded-2xl bg-white px-3 py-2 text-sm transition text-red-500
                                                            hover:bg-red-50 hover:text-red-600"
                                                >
                                                ❌
                                                </button>
                                            </div>

                                            </div>
                                        </div>

                                        {/* 현재 선택한 todo에만 리뷰 이모지 패널 표시, ref로 외부 클릭 감지 대상 지정 */}
                                        {reviewTodoId === todo.id && (
                                            <div
                                                ref={reviewPickerRef}
                                                className="mt-2 flex justify-end gap-1.5"
                                            >
                                                {emojiList.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => reviewTodoHandler(todo.id, emoji)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base transition hover:bg-green-100"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
