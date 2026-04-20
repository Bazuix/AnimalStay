import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2>AnimalStay 🐾</h2>
            <div>
                <Link to="/">Home</Link>
                <Link to="/pets">Pets</Link>
            </div>
        </nav>
    );
};

export default Navbar;