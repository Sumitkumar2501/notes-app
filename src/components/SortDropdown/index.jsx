import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const SortDropdown = ({ sortBy, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [alignLeft, setAlignLeft] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

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

    // Detect if we need to align left to prevent overflow
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const spaceOnRight = viewportWidth - buttonRect.right;
            
            // Need space for dropdown (~200px) + margin (16px)
            const needsLeftAlign = spaceOnRight < 216;
            setAlignLeft(needsLeftAlign);
        }
    }, [isOpen]);

    return (
        <div className="relative z-30" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border font-medium text-xs sm:text-base transition-all duration-200 hover:opacity-80 active:scale-95 touch-manipulation whitespace-nowrap"
                style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)',
                    minHeight: '40px'
                }}
                title="Sort notes"
            >
                <span className="hidden sm:inline">{currentLabel}</span>
                <span className="sm:hidden text-xs">Sort</span>
                <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full mt-2 rounded-lg border shadow-lg z-50 py-1 animate-fade-in max-h-[300px] overflow-y-auto"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        boxShadow: 'var(--shadow-lg)',
                        // Base sizing
                        minWidth: '160px',
                        width: 'auto',
                        // Desktop: right-aligned; Mobile: left-aligned or full-width
                        ...(typeof window !== 'undefined' && window.innerWidth <= 480 
                            ? {
                                // Mobile: Use left alignment with viewport margin
                                left: 'auto',
                                right: '0px',
                                maxWidth: '90vw',
                                minWidth: '90vw',
                            }
                            : alignLeft
                            ? {
                                // Tablet+: Left alignment if no space on right
                                left: '0px',
                                right: 'auto',
                                maxWidth: '240px'
                            }
                            : {
                                // Tablet+: Right alignment (default)
                                right: '0px',
                                left: 'auto',
                                maxWidth: '240px'
                            }
                        )
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="block w-full text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm transition-all duration-150 hover:opacity-80 active:scale-95 touch-manipulation"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: sortBy === option.value ? 'var(--accent-light)' : 'transparent',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <span className="flex items-center gap-2 w-full">
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
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
