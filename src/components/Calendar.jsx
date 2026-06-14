import { useState } from "react";
import "../styles/Calendar.css";

function Calendar({selectedDate, setSelectedDate, todos}) {
    const [now, setNow] = useState(new Date());

    const year = now.getFullYear();
    const month = now.getMonth();

    const formatDate = (date) => date.toISOString().split("T")[0];

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];

    // 앞 빈칸
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-start-${i}`}></div>);
    }

    // 날짜
    for (let i = 1; i <= lastDate; i++) {
        const week = new Date(year, month, i).getDay();

        let className = "";

        if (week === 0) className = "red";
        if (week === 6) className = "blue";

        const isSelected =
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === i;

        const dateStr = formatDate(new Date(year, month, i));
        const hasTodo = todos.some((todo) => todo.date === dateStr);

        days.push(
            <div key={i} className={className}>
                <div
                    className={isSelected ? "selected" : ""}
                    onClick={() => setSelectedDate(new Date(year, month, i))}
                    style={{ position: "relative" }}
                >
                    {i}

                    {hasTodo && (
                        <div
                            style={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: "orange",
                                borderRadius: "50%",
                                position: "absolute",
                                bottom: "-5px",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 뒤 빈칸
    const remain = 42 - (firstDay + lastDate);

    for (let i = 0; i < remain; i++) {
        days.push(<div key={`empty-end-${i}`}></div>);
    }

    const prevMonth = () => {
        setNow(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setNow(new Date(year, month + 1, 1));
    };

    return (
        <div className="calendar">
            <div className="top">
                <button onClick={prevMonth}>◀</button>
                <h2>
                    {year}년 {month + 1}월
                </h2>
                <button onClick={nextMonth}>▶</button>
            </div>

            <div className="day">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
            </div>

            <div className="date">
                {days}
            </div>
        </div>
    );
}

export default Calendar;