import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const SortDropdown = ({ sortBy, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'updated', label: 'Recently Updated' },
        { value: 'alphabetical', label: 'Alphabetical (A-Z)' }
    ];

    const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort Notes';

    const handleSelect = (value) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border font-medium text-sm sm:text-base transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)'
                }}
                title="Sort notes"
            >
                <span className="hidden sm:inline">{currentLabel}</span>
                <span className="sm:hidden">Sort</span>
                <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-2 rounded-lg border shadow-lg z-40 min-w-[160px] py-1 animate-fade-in"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all duration-150 hover:opacity-80 active:scale-95"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: sortBy === option.value ? 'var(--accent-light)' : 'transparent'
                            }}
                        >
                            <span className="flex items-center gap-2">
                                {sortBy === option.value && (
                                    <span style={{ color: 'var(--accent-color)' }}>✓</span>
                                )}
                                <span className={sortBy === option.value ? 'font-medium' : ''}>{option.label}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
