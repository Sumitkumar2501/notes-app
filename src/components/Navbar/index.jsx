import { Search, Sun, Moon } from "lucide-react";
import { useNotes } from "../../context/notes-context";
import { useTheme } from "../../context/theme-context";
import { Link } from "react-router-dom";
import { memo } from "react";

const NavbarComponent = () => {
    const { searchQuery, setSearchQuery, fontFamily, setFontFamily } = useNotes();
    const { theme, toggleTheme } = useTheme();

    return(
        <header className='flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b shadow-sm backdrop-blur-md' style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(12px)', transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', paddingLeft: 'max(8px, calc(8px + env(safe-area-inset-left)))', paddingRight: 'max(8px, calc(8px + env(safe-area-inset-right)))' }}>
            {/* Logo & Brand */}
            <Link to="/" className='flex items-center gap-2 sm:gap-2.5 flex-shrink-0 no-underline min-w-fit group'>
                <div 
                    className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-105 group-hover:shadow-md'
                    style={{ 
                        backgroundColor: 'var(--accent-light)', 
                        borderColor: 'var(--border-primary)',
                        color: 'var(--accent-color)',
                        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out'
                    }}
                >
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 100 100" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="7" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="sm:w-[22px] sm:h-[22px]"
                    >
                        {/* Book pages outlines */}
                        <path d="M50 78C40 75 24 75 16 77V23C24 21 40 21 50 23" />
                        <path d="M50 23C60 21 76 21 84 23V54" />
                        <path d="M50 78C56 76 66 75 74 76" />
                        <path d="M50 23V78" strokeWidth="9" />

                        {/* Left page lines */}
                        <path d="M24 36H42" strokeWidth="6" />
                        <path d="M24 48H42" strokeWidth="6" />
                        <path d="M24 60H42" strokeWidth="6" />

                        {/* Right page lines */}
                        <path d="M58 36H76" strokeWidth="6" />
                        <path d="M58 48H66" strokeWidth="6" />

                        {/* Pencil drawing on right page */}
                        <path 
                            d="M60 72L81 51C82.5 49.5 85 49.5 86.5 51C88 52.5 88 55 86.5 56.5L65.5 77.5L59 80L60 72Z" 
                            fill="currentColor" 
                            fillOpacity="0.2" 
                            strokeWidth="6" 
                        />
                        <path d="M77 55L82 60" strokeWidth="5" />
                    </svg>
                </div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight transition-colors duration-300 group-hover:opacity-90" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    NoteIt
                </h1>
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
            
            {/* Right Header Actions */}
            <div className="flex items-center gap-2">
                {/* Font Selector with Google Icon */}
                <div 
                    className="flex items-center gap-1.5 px-2.5 rounded-lg border transition-colors duration-200"
                    style={{
                        backgroundColor: 'var(--bg-hover)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                        minHeight: '40px'
                    }}
                >
                    <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                        text_format
                    </span>
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="block bg-transparent font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer border-none py-1 pr-1"
                        title="Change notes font style"
                        aria-label="Change notes font style"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <option value="sans" style={{ backgroundColor: 'var(--bg-secondary)' }}>Sans</option>
                        <option value="serif" style={{ backgroundColor: 'var(--bg-secondary)' }}>Serif</option>
                        <option value="handwriting" style={{ backgroundColor: 'var(--bg-secondary)' }}>Handwriting</option>
                        <option value="typewriter" style={{ backgroundColor: 'var(--bg-secondary)' }}>Typewriter</option>
                    </select>
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
            </div>
        </header>
    )
}

// Memoize Navbar to prevent unnecessary re-renders
export const Navbar = memo(NavbarComponent);