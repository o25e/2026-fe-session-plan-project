import { useState } from "react";
import Calendar from "../components/Calendar";

function Main() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const formDate = (date) => date.toISOString().split("T")[0];

    const addTodo = () => {
        if (!input.trim()) return;

        setTodos([
            ...todos,
            {
                id: Date.now(),
                text: input,
                completed: false,
                date: formDate(selectedDate),
            },
        ]);

        setInput("");
    };

    const toggleComplete = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    }

    const saveEdit = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id
                    ? {
                        ...todo,
                        text: editText,
                    }
                    : todo
            )
        );

        setEditingId(null);
        setEditText("");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 제목 */}
            <div className="pt-12 text-center">
                <h1 className="text-4xl font-bold text-orange-500">
                    To Do
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    나만의 일정 관리 서비스
                </p>
            </div>

            {/* 달력 + 할 일 목록 */}
            <div className="mt-10 flex justify-center gap-8 px-4 pb-10">
                {/* 달력 */}
                <div className="rounded-3xl bg-white p-6 shadow">
                    <Calendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                </div>

                {/* 할 일 목록 */}
                <div className="w-[450px] rounded-3xl bg-white p-6 shadow">
                    <h2 className="mb-6 text-center text-2xl font-bold">
                        To Do List
                    </h2>

                    {/* 입력창 */}
                    <div className="mb-5 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="할 일을 입력하세요"
                            className="flex-1 rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
                        />

                        <button
                            onClick={addTodo}
                            className="rounded-xl bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600"
                        >
                            추가
                        </button>
                    </div>

                    {/* 할 일 목록 */}
                    <div className="space-y-3">
                        {todos
                            .filter((todo) => todo.date === formDate(selectedDate))
                            .map((todo) => (
                            <div
                                key={todo.id}
                                className="rounded-xl bg-orange-100 p-4"
                            >
                                <div className="flex items-center justify-between">

                                    {/* 왼쪽: 체크박스 */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() =>
                                                toggleComplete(todo.id)
                                            }
                                            className="h-5 w-5 cursor-pointer accent-orange-500"
                                        />

                                        {/* 수정 중이면 input 표시 */}
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
                                                className="rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-orange-500"
                                            />
                                        ) : (
                                            <span
                                                className={
                                                    todo.completed
                                                        ? "line-through text-gray-400"
                                                        : ""
                                                }
                                            >
                                                {todo.text}
                                            </span>
                                        )}
                                    </div>

                                    {/* 오른쪽: 수정 + 삭제 버튼 */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(todo)}
                                            className="rounded-lg bg-white px-2 py-1 hover:bg-gray-200"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="rounded-lg bg-white px-2 py-1 text-gray-600 hover:bg-gray-200"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;