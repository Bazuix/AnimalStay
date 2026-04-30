import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

// ─────────────────────────────────────────────────────────────
// Home page tests
// ─────────────────────────────────────────────────────────────

const renderHome = () =>
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );



describe("Home page – positive scenarios", () => {
    it("renders the main heading", () => {
        renderHome();
        expect(
            screen.getByText(/Welcome to AnimalStay/i)
        ).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
        renderHome();
        expect(
            screen.getByText(/Professional hotel management system/i)
        ).toBeInTheDocument();
    });

    it("renders the paw emoji", () => {
        renderHome();
        expect(screen.getByText("🐾")).toBeInTheDocument();
    });

    it("renders all 4 navigation cards", () => {
        renderHome();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Room Map")).toBeInTheDocument();
        expect(screen.getByText("Book a Stay")).toBeInTheDocument();
        expect(screen.getByText("Manage Pets")).toBeInTheDocument();
    });

    it("each card has a description", () => {
        renderHome();
        expect(screen.getByText(/currently checked in/i)).toBeInTheDocument();
        expect(
            screen.getByText(/date range to see what's occupied/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/check-in\/out dates/i)).toBeInTheDocument();
        expect(screen.getByText(/owner information/i)).toBeInTheDocument();
    });

    it("Dashboard card links to /dashboard", () => {
        renderHome();
        const link = screen.getByText("Dashboard").closest("a");
        expect(link).toHaveAttribute("href", "/dashboard");
    });

    it("renders card icons", () => {
        renderHome();
        expect(screen.getByText("🏠")).toBeInTheDocument();
        expect(screen.getByText("🗺️")).toBeInTheDocument();
        expect(screen.getByText("📅")).toBeInTheDocument();
        expect(screen.getByText("🐶")).toBeInTheDocument();
    });
});


describe("Home page – negative scenarios", () => {
    it("does NOT render admin-only content (PASS)", () => {
        renderHome();

        expect(
            screen.queryByText(/Admin Panel/i)
        ).not.toBeInTheDocument();
    });

    it("FAIL: expects a non-existing heading", () => {
        renderHome();


        expect(
            screen.getByText(/Welcome Admin/i)
        ).toBeInTheDocument();
    });

    it("FAIL: expects 5 navigation cards instead of 4", () => {
        renderHome();


        const cards = screen.getAllByRole("link");
        expect(cards).toHaveLength(5);
    });

    it("FAIL: expects wrong route for Room Map", () => {
        renderHome();

        const link = screen.getByText("Room Map").closest("a");


        expect(link).toHaveAttribute("href", "/room-map");
    });

    it("FAIL: expects paw emoji NOT to be rendered", () => {
        renderHome();


        expect(
            screen.queryByText("🐾")
        ).not.toBeInTheDocument();
    });
});