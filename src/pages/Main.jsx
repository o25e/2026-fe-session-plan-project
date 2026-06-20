import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import { getTodos, createTodo, updateTodo, removeTodo, checkTodo } from "../api/todoApi";

function Main() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const formDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatTitleDate = (date) => {
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const loadTodos = async () => {
        try{
            const memberId = localStorage.getItem("memberId");

            const data = await getTodos(memberId);

            const formattedTodos = data.map((todo) => ({
                id: todo.todo_id,
                text: todo.content,
                completed: todo.is_checked,
                date: todo.date.split("T")[0], // 2025-06-17T18:30:00 -> 2024-06-17 로 변환하여 저장
            }));

            console.log(data);

            setTodos(formattedTodos);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const addTodo = async () => {
        if (!input.trim()) return;

        try {
            const memberId = localStorage.getItem("memberId");

            await createTodo(
                memberId,
                selectedDate.toISOString(),
                input
            );

            await loadTodos();

            setInput("");
        } catch (error) {
            alert(error.message);
        }

        setInput("");
    };

    const toggleComplete = async (id) => {
        try {
            const memberId = localStorage.getItem("memberId");

            await checkTodo(memberId, id);

            await loadTodos();
        } catch (error) {
            alert(error.message);
        }
    };

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

    const saveEdit = async (id) => {
        try {
            const memberId = localStorage.getItem("memberId");

            await updateTodo(
                memberId,
                id,
                selectedDate.toISOString(),
                editText
            );

            await loadTodos();

            setEditingId(null);
            setEditText("");
        } catch (error) {
            alert(error.message);
        }
    };

    const todaysTodos = todos.filter((todo) => todo.date === formDate(selectedDate));
    const completedCount = todaysTodos.filter((todo) => todo.completed).length;
    const sortedTodos = [...todaysTodos].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-12">
            <div className="mx-auto max-w-6xl px-4">
                {/* 제목 */}
                <div className="mb-10 text-center">
                    <h1 className="mt-4 text-5xl font-extrabold text-orange-500">
                        To Do
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        나만의 일정 관리 서비스
                    </p>
                </div>

                {/* 달력 + 할 일 목록 */}
                <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                    <div className="rounded-4xl bg-white p-6 shadow-md">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            todos={todos}
                        />
                    </div>

                    <div className="rounded-4xl bg-white p-8 shadow-md">
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
                                    <div
                                        key={todo.id}
                                        className="rounded-3xl border border-slate-200 bg-orange-50 p-4 shadow-sm"
                                    >
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
                                                    <span
                                                        className={`text-sm ${
                                                            todo.completed
                                                                ? "line-through text-slate-400"
                                                                : "text-slate-900"
                                                        }`}
                                                    >
                                                        {todo.text}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(todo)}
                                                    className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
                                                >
                                                    수정
                                                </button>

                                                <button
                                                    onClick={() => deleteTodo(todo.id)}
                                                    className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
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