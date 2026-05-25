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
        <header className='flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b shadow-sm backdrop-blur-md' style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(12px)', transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', paddingLeft: 'max(8px, calc(8px + env(safe-area-inset-left)))', paddingRight: 'max(8px, calc(8px + env(safe-area-inset-right)))' }}>
            {/* Logo & Brand */}
            <Link to="/" className='flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 no-underline min-w-fit'>
                <div className='w-8 sm:w-10 h-8 sm:h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0'>
                    <img className='w-full h-full object-cover' src={notesImg} alt="NoteIt logo"/>
                </div>
                <h1 className="text-base sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--accent-color)', transition: 'color 0.3s ease-in-out', whiteSpace: 'nowrap' }}>NoteIt</h1>
            </Link>
            
            {/* Search Bar - Mobile optimized */}
            <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} style={{ color: 'var(--text-tertiary)', transition: 'color 0.3s ease-in-out' }} />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 sm:py-2.5 rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[length:0px] text-xs sm:text-sm border transition-all duration-200"
                    style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-primary)',
                        '--tw-ring-color': 'var(--accent-color)',
                        '--tw-ring-offset-color': 'transparent',
                        minHeight: '40px'
                    }}
                />
            </div>
            
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:opacity-80 active:scale-95 flex-shrink-0 touch-manipulation transition-all duration-200"
                style={{
                    backgroundColor: 'var(--bg-hover)',
                    color: 'var(--text-primary)',
                    minHeight: '40px',
                    minWidth: '40px'
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