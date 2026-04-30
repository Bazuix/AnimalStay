import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { to: "/",             label: "Home",      icon: "🏠" },
        { to: "/dashboard",    label: "Dashboard", icon: "📊" },
        { to: "/rooms",        label: "Room Map",  icon: "🗺️" },
        { to: "/pets",         label: "Pets",      icon: "🐾" },
        { to: "/reservations", label: "Book Stay", icon: "📅" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        setMenuOpen(false);
    };

    const close = () => setMenuOpen(false);

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-brand" onClick={close}>
                    <span className="paw">🐾</span>
                    <span className="brand-text">AnimalStay</span>
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

                <div className="navbar-right">
                    <button className="btn ghost sm logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                    <button
                        className={`hamburger ${menuOpen ? "open" : ""}`}
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {menuOpen && <div className="mobile-overlay" onClick={close} />}

            <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
                <div className="mobile-drawer-header">
                    <span>🐾 AnimalStay</span>
                    <button className="mobile-close" onClick={close}>✕</button>
                </div>
                <nav className="mobile-nav-links">
                    {links.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`mobile-nav-link ${location.pathname === l.to ? "active" : ""}`}
                            onClick={close}
                        >
                            <span className="mnl-icon">{l.icon}</span>
                            <span>{l.label}</span>
                        </Link>
                    ))}
                </nav>
                <button className="mobile-logout" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </>
    );
};

export default Navbar;