import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Main from "./pages/Main"

function App() {
    return (
        <div className="text-center">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
