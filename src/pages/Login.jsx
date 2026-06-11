import { Link } from "react-router";

function Login() {
    return (
        <div className="min-h-screen flex flex-col justify-center bg-gray-100">
            {/* 제목 */}
            <div className="mb-8 text-center pt-12">
                <h1 className="text-4xl font-bold text-orange-500">
                    To Do
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    나만의 일정 관리 서비스
                </p>
            </div>

            <div className="flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-left">
                {/* 입력창 */}
                <div className="space-y-5">
                
                {/* 아이디 */}
                <div>
                    <div className="mb-2 block text-sm font-medium text-gray-700">
                    아이디
                    </div>

                    <input
                    type="text"
                    placeholder="ID"
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500"
                    />
                </div>

                {/* 비밀번호 */}
                <div>
                    <div className="mb-2 block text-sm font-medium text-gray-700">
                    비밀번호
                    </div>

                    <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500"
                    />
                </div>
                </div>

                {/* 버튼 */}
                <button
                className="mt-8 w-full rounded-xl bg-orange-500 p-3 font-semibold text-white transition hover:bg-orange-600"
                >
                로그인
                </button>

                {/* 회원가입 이동 */}
                <p className="mt-6 text-center text-sm text-gray-500">
                계정이 없으신가요?{" "}
                    <Link to="/signup" className="cursor-pointer font-semibold text-orange-500 hover:underline">
                        회원가입
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

export default Login;