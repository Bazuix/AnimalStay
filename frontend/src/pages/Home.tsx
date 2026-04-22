import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home-page page-wrap">
            <div className="home-hero">
                <div className="hero-paw">🐾</div>
                <h1>Welcome to AnimalStay</h1>
                <p>Professional hotel management system for your furry, feathered, and scaly guests.</p>
            </div>

            <div className="home-cards grid-3">
                <Link to="/dashboard" className="home-card card">
                    <div className="hc-icon">🏠</div>
                    <h3>Dashboard</h3>
                    <p>See which animals are currently checked in and what care they need today.</p>
                </Link>
                <Link to="/reservations" className="home-card card">
                    <div className="hc-icon">📅</div>
                    <h3>Book a Stay</h3>
                    <p>Register a new pet stay with check-in/out dates, room selection, and services.</p>
                </Link>
                <Link to="/pets" className="home-card card">
                    <div className="hc-icon">🐶</div>
                    <h3>Manage Pets</h3>
                    <p>Add, view and manage all pets and their owner information.</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;