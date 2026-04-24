import { useState, useRef, useEffect } from "react";

interface Props {
    value: string;              // YYYY-MM-DD
    onChange: (date: string) => void;
    min?: string;               // YYYY-MM-DD
    label?: string;
    placeholder?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function parseDate(s: string): Date | null {
    if (!s) return null;
    const d = new Date(s + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date): string {
    return d.toISOString().split("T")[0];
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth()    === b.getMonth()    &&
        a.getDate()     === b.getDate();
}

export default function DatePicker({ value, onChange, min, label, placeholder = "Pick a date" }: Props) {
    const selected  = parseDate(value);
    const minDate   = parseDate(min || "") ;

    const [open, setOpen]       = useState(false);
    const [viewYear, setViewYear]  = useState(() => selected?.getFullYear()  ?? new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(() => selected?.getMonth()    ?? new Date().getMonth());
    const [hovered, setHovered] = useState<Date | null>(null);

    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Sync view to value when opened
    useEffect(() => {
        if (open && selected) {
            setViewYear(selected.getFullYear());
            setViewMonth(selected.getMonth());
        }
    }, [open]);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        if (minDate && d < minDate) return;
        onChange(toStr(d));
        setOpen(false);
    };

    const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
    const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);
    const today = new Date();

    const displayValue = selected
        ? selected.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "";

    return (
        <div className="dp-wrap" ref={ref}>
            {label && <label className="dp-label">{label}</label>}

            <button
                type="button"
                className={`dp-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen(o => !o)}
            >
                <span className="dp-cal-icon">📅</span>
                <span className={displayValue ? "dp-value" : "dp-placeholder"}>
          {displayValue || placeholder}
        </span>
                <span className="dp-chevron">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="dp-popup">
                    {/* Month/year nav */}
                    <div className="dp-header">
                        <button type="button" className="dp-nav-btn" onClick={prevMonth}>‹</button>
                        <div className="dp-month-label">
                            {MONTHS[viewMonth]} {viewYear}
                        </div>
                        <button type="button" className="dp-nav-btn" onClick={nextMonth}>›</button>
                    </div>

                    {/* Year quick-jump */}
                    <div className="dp-year-row">
                        {[-2, -1, 0, 1, 2].map(offset => {
                            const y = new Date().getFullYear() + offset;
                            return (
                                <button
                                    key={y}
                                    type="button"
                                    className={`dp-year-btn ${y === viewYear ? "active" : ""}`}
                                    onClick={() => setViewYear(y)}
                                >{y}</button>
                            );
                        })}
                    </div>

                    {/* Day headers */}
                    <div className="dp-grid">
                        {DAYS.map(d => (
                            <div key={d} className="dp-day-name">{d}</div>
                        ))}

                        {/* Empty cells before first day */}
                        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                            <div key={`e${i}`} />
                        ))}

                        {/* Day cells */}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const date     = new Date(viewYear, viewMonth, day);
                            const isToday  = sameDay(date, today);
                            const isSel    = selected && sameDay(date, selected);
                            const isHov    = hovered && sameDay(date, hovered);
                            const isPast   = minDate && date < minDate;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={!!isPast}
                                    className={[
                                        "dp-day",
                                        isToday ? "today"    : "",
                                        isSel   ? "selected" : "",
                                        isHov   ? "hovered"  : "",
                                        isPast  ? "past"     : "",
                                    ].filter(Boolean).join(" ")}
                                    onClick={() => handleDayClick(day)}
                                    onMouseEnter={() => setHovered(date)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Today shortcut */}
                    <div className="dp-footer">
                        <button
                            type="button"
                            className="dp-today-btn"
                            onClick={() => {
                                const t = new Date();
                                if (!minDate || t >= minDate) {
                                    onChange(toStr(t));
                                    setOpen(false);
                                } else {
                                    setViewYear(minDate.getFullYear());
                                    setViewMonth(minDate.getMonth());
                                }
                            }}
                        >Go to today</button>
                        {selected && (
                            <button
                                type="button"
                                className="dp-clear-btn"
                                onClick={() => { onChange(""); setOpen(false); }}
                            >Clear</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}