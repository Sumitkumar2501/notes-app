import { X, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';

export const EditNoteModal = ({ note, isOpen, onClose, onSave }) => {
    const [editTitle, setEditTitle] = useState('');
    const [editText, setEditText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle opening animation
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setEditTitle(note?.title || '');
            setEditText(note?.text || '');
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [note, isOpen]);

    // Memoize handleCancel to avoid unnecessary re-renders and effects
    const handleCancel = useCallback(() => {
        setEditTitle('');
        setEditText('');
        onClose();
    }, [onClose]);

    const handleSave = () => {
        if (!editTitle.trim()) {
            toast.error('Title cannot be empty');
            return;
        }

        onSave({
            title: editTitle,
            text: editText
        });

        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    // Handle ESC key – now includes handleCancel as a dependency
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                handleCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, handleCancel]);

    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <>
            {/* Backdrop - Covers entire screen and blocks all background interaction */}
            <div
                className="fixed inset-0 z-40 pointer-events-auto"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                    pointerEvents: isAnimating ? 'auto' : 'none'
                }}
                onClick={handleBackdropClick}
            />

            {/* Modal Container - Fixed positioning for true overlay */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                style={{
                    animation: isAnimating ? 'modalFadeIn 0.3s ease-out' : 'modalFadeOut 0.3s ease-out',
                    paddingBottom: 'max(1rem, calc(64px + 1rem + env(safe-area-inset-bottom)))',
                    // On mobile, scroll the modal area if needed
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {/* Modal - Re-enables pointer events */}
                <div
                    className="w-full max-w-2xl max-h-[calc(100vh-120px)] sm:max-h-[85vh] overflow-hidden flex flex-col rounded-xl sm:rounded-2xl pointer-events-auto"
                    style={{
                        backgroundColor: 'var(--card-bg)',
                        boxShadow: isAnimating 
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        opacity: isAnimating ? 1 : 0,
                        transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        border: '1px solid var(--border-primary)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-6 py-4 sm:py-5 border-b"
                        style={{
                            borderColor: 'var(--border-primary)',
                            backgroundColor: 'var(--bg-secondary)'
                        }}
                    >
                        <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Edit Note
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                            style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-secondary)'
                            }}
                            title="Close (ESC)"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-6 space-y-4 sm:space-y-5">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="edit-title"
                                className="block text-sm font-medium"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Title
                            </label>
                            <input
                                id="edit-title"
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                                placeholder="Enter note title"
                                className="w-full px-4 py-3 sm:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-base"
                                style={{
                                    backgroundColor: 'var(--input-bg)',
                                    borderColor: 'var(--input-border)',
                                    color: 'var(--text-primary)',
                                    '--tw-ring-color': 'var(--accent-color)',
                                    '--tw-ring-offset-color': 'var(--bg-secondary)'
                                }}
                            />
                        </div>

                        {/* Content Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="edit-text"
                                className="block text-sm font-medium"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Content
                            </label>
                            <textarea
                                id="edit-text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                placeholder="Enter note content"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 resize-none min-h-[150px] sm:min-h-[200px] text-base"
                                style={{
                                    backgroundColor: 'var(--input-bg)',
                                    borderColor: 'var(--input-border)',
                                    color: 'var(--text-primary)',
                                    '--tw-ring-color': 'var(--accent-color)',
                                    '--tw-ring-offset-color': 'var(--bg-secondary)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="flex items-center justify-end gap-3 px-6 py-4 sm:py-5 border-t"
                        style={{
                            borderColor: 'var(--border-primary)',
                            backgroundColor: 'var(--bg-secondary)'
                        }}
                    >
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-80 active:scale-95 text-sm sm:text-base"
                            style={{
                                backgroundColor: 'var(--bg-hover)',
                                color: 'var(--text-primary)',
                                border: `1px solid var(--border-primary)`
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-85 active:scale-95 text-sm sm:text-base"
                            style={{
                                backgroundColor: 'var(--accent-color)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <Check size={18} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes modalFadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `}</style>
        </>,
        modalRoot
    );
};