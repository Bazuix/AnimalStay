import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const links = [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/pets", label: "Pets" },
        { to: "/reservations", label: "Book Stay" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="paw">🐾</span>
                <span>AnimalStay</span>
            </Link>
            <div className="navbar-links">
                {links.map((l) => (
                    <Link
                        key={l.to}
                        to={l.to}
                        className={`nav-link ${location.pathname === l.to ? "active" : ""}`}
                    >
                        {l.label}
                    </Link>
                ))}
            </div>
            <button className="btn ghost sm" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default Navbar;