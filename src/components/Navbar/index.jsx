import notesImg from "../../assets/notes.jpg";
import { Search, Sun, Moon } from "lucide-react";
import { useNotes } from "../../context/notes-context";
import { useTheme } from "../../context/theme-context";
import { Link } from "react-router-dom";
import { memo } from "react";

const NavbarComponent = () => {
    const { searchQuery, setSearchQuery } = useNotes();
    const { theme, toggleTheme } = useTheme();

    return(
        <header className='flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b shadow-sm backdrop-blur-md' style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(12px)', transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out' }}>
            {/* Logo */}
            <Link to="/" className='flex items-center gap-2 sm:gap-3 flex-shrink-0 no-underline'>
                <div className='w-9 sm:w-10 h-9 sm:h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0'>
                    <img className='w-full h-full object-cover' src={notesImg} alt="NoteIt logo"/>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight hidden sm:block" style={{ color: 'var(--accent-color)', transition: 'color 0.3s ease-in-out' }}>NoteIt</h1>
            </Link>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs sm:max-w-md hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} style={{ color: 'var(--text-tertiary)', transition: 'color 0.3s ease-in-out' }} />
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[length:0px] text-sm border"
                    style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-primary)',
                        '--tw-ring-color': 'var(--accent-color)',
                        '--tw-ring-offset-color': 'transparent',
                        transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out'
                    }}
                />
            </div>
            
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:opacity-80 active:scale-95 flex-shrink-0"
                style={{
                    backgroundColor: 'var(--bg-hover)',
                    color: 'var(--text-primary)',
                    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out'
                }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <Moon size={18} className="sm:w-5 sm:h-5" />
                ) : (
                    <Sun size={18} className="sm:w-5 sm:h-5" />
                )}
            </button>
        </header>
    )
}

// Memoize Navbar to prevent unnecessary re-renders
export const Navbar = memo(NavbarComponent);