import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isListPage = location.pathname === "/";

  return (
    <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span className="font-semibold tracking-tight text-[15px]">
            Support<span className="text-[var(--color-accent)]">CRM</span>
          </span>
        </Link>

        {!isListPage && (
          <Link
            to="/"
            className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
          >
            ← All tickets
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;