import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Reservations from "./pages/Reservations";
import Dashboard from "./pages/Dashboard";
import RoomMap from "./pages/RoomMap";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/app.scss";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />


                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />

                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/pets" element={<Pets />} />
                                    <Route path="/reservations" element={<Reservations />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/rooms" element={<RoomMap />} />
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;