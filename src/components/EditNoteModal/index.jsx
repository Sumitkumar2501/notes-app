import { X, Check, Plus, AlignLeft, CheckSquare } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';

export const EditNoteModal = ({ note, isOpen, onClose, onSave }) => {
    const [editTitle, setEditTitle] = useState('');
    const [editText, setEditText] = useState('');
    const [editType, setEditType] = useState('text');
    const [editTodos, setEditTodos] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [editTags, setEditTags] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle opening animation & populate states
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setEditTitle(note?.title || '');
            setEditText(note?.text || '');
            setEditType(note?.type || 'text');
            setEditTodos(note?.todos ? [...note.todos] : []);
            setEditTags(note?.tags ? [...note.tags] : []);
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
        setEditType('text');
        setEditTodos([]);
        setEditTags([]);
        setTagInput('');
        onClose();
    }, [onClose]);

    const handleSave = () => {
        if (!editTitle.trim()) {
            toast.error('Title cannot be empty');
            return;
        }

        let finalBodyText = editText;
        let validTodos = [];
        if (editType === 'todo') {
            validTodos = editTodos.filter(t => t.text.trim() !== '');
            finalBodyText = validTodos.map(t => `- [${t.isCompleted ? 'x' : ' '}] ${t.text}`).join('\n');
        }

        let finalTags = [...editTags];
        const currentInputTag = tagInput.trim().toLowerCase().replace('#', '');
        if (currentInputTag && !finalTags.includes(currentInputTag)) {
            finalTags.push(currentInputTag);
        }

        onSave({
            title: editTitle,
            text: finalBodyText,
            type: editType,
            todos: validTodos,
            tags: finalTags
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

    // Toggle note type in modal editor
    const toggleNoteType = () => {
        const newType = editType === 'text' ? 'todo' : 'text';
        setEditType(newType);
        if (newType === 'todo' && editTodos.length === 0) {
            setEditTodos([{ id: Date.now().toString(), text: '', isCompleted: false }]);
        }
    };

    // Checklist handlers inside modal
    const handleTodoTextChange = (id, newText) => {
        setEditTodos(editTodos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    };

    const addTodoItem = () => {
        setEditTodos([...editTodos, { id: Date.now().toString(), text: '', isCompleted: false }]);
    };

    const removeTodoItem = (id) => {
        setEditTodos(editTodos.filter(todo => todo.id !== id));
    };

    const toggleTodoCheck = (id) => {
        setEditTodos(editTodos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    };

    const handleTodoKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodoItem();
        }
    };

    // Explicit tag managers inside modal
    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.type === 'click') {
            e.preventDefault();
            const val = tagInput.trim().toLowerCase().replace('#', '');
            if (val && !editTags.includes(val)) {
                setEditTags([...editTags, val]);
            }
            setTagInput('');
        }
    };

    const handleAddTagOnBlur = () => {
        const val = tagInput.trim().toLowerCase().replace('#', '');
        if (val && !editTags.includes(val)) {
            setEditTags([...editTags, val]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setEditTags(editTags.filter(t => t !== tagToRemove));
    };

    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 pointer-events-auto"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                    pointerEvents: isAnimating ? 'auto' : 'none'
                }}
                onClick={handleBackdropClick}
            />

            {/* Modal Container */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                style={{
                    animation: isAnimating ? 'modalFadeIn 0.3s ease-out' : 'modalFadeOut 0.3s ease-out',
                    paddingBottom: 'max(1rem, calc(64px + 1rem + env(safe-area-inset-bottom)))',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {/* Modal main box */}
                <div
                    className="w-full max-w-2xl max-h-[calc(100vh-120px)] sm:max-h-[80vh] overflow-hidden flex flex-col rounded-xl sm:rounded-2xl pointer-events-auto note-default paper-texture transition-all duration-300"
                    style={{
                        boxShadow: isAnimating 
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)' 
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
                            borderColor: 'rgba(0,0,0,0.06)',
                            backgroundColor: 'rgba(0,0,0,0.02)'
                        }}
                    >
                        <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            Edit Note
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                            style={{
                                color: 'var(--text-secondary)'
                            }}
                            title="Close (ESC)"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Title Input */}
                        <div className="space-y-1">
                            <label
                                htmlFor="edit-title"
                                className="block text-xs font-bold uppercase tracking-wider text-tertiary"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Title
                            </label>
                            <input
                                id="edit-title"
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter note title"
                                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-semibold bg-transparent"
                                style={{
                                    borderColor: 'rgba(0,0,0,0.12)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </div>

                        {/* Note content (Textarea or Checklist) */}
                        <div className="space-y-1">
                            <label
                                className="block text-xs font-bold uppercase tracking-wider text-tertiary"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Content
                            </label>
                            {editType === 'todo' ? (
                                <div className="space-y-2 p-3 rounded-lg border bg-black/[0.01]" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                                    {editTodos.map((todo, index) => (
                                        <div key={todo.id} className="flex items-center gap-2 animate-fade-in">
                                            <input
                                                type="checkbox"
                                                checked={todo.isCompleted}
                                                onChange={() => toggleTodoCheck(todo.id)}
                                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                style={{ accentColor: 'var(--accent-color)' }}
                                            />
                                            <input
                                                type="text"
                                                value={todo.text}
                                                onChange={(e) => handleTodoTextChange(todo.id, e.target.value)}
                                                onKeyDown={(e) => handleTodoKeyDown(e, index)}
                                                className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-400 focus:outline-none py-1 leading-normal"
                                                placeholder="List item..."
                                                style={{ color: 'var(--text-secondary)' }}
                                                autoFocus={index === editTodos.length - 1 && editTodos.length > 1}
                                            />
                                            {editTodos.length > 1 && (
                                                <button
                                                    onClick={() => removeTodoItem(todo.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors duration-150 rounded"
                                                    title="Remove item"
                                                >
                                                    <Plus size={15} className="transform rotate-45" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addTodoItem}
                                        className="text-xs font-semibold py-1.5 px-3 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 flex items-center gap-1 mt-1"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <Plus size={13} /> Add item
                                    </button>
                                </div>
                            ) : (
                                <textarea
                                    id="edit-text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="Enter note content"
                                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-200 resize-none min-h-[140px] sm:min-h-[180px] text-sm bg-transparent leading-relaxed"
                                    style={{
                                        borderColor: 'rgba(0,0,0,0.12)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                            )}
                        </div>

                        {/* Labels / Tags Tray */}
                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-tertiary" style={{ color: 'var(--text-tertiary)' }}>
                                Labels
                            </label>
                            <div className="p-2.5 rounded-lg border flex flex-wrap items-center gap-1.5 bg-black/[0.01]" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                                {editTags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                                        style={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                                            color: 'var(--text-secondary)',
                                            border: '1px solid rgba(0, 0, 0, 0.03)'
                                        }}
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-500 font-bold ml-0.5 text-[10px]"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="+ Add label"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    onBlur={handleAddTagOnBlur}
                                    className="text-xs bg-transparent focus:outline-none placeholder-opacity-50 min-h-[26px] flex-grow max-w-[120px]"
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Toolbar */}
                    <div
                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t"
                        style={{
                            borderColor: 'rgba(0,0,0,0.06)',
                            backgroundColor: 'rgba(0,0,0,0.02)'
                        }}
                    >
                        {/* Selector tools */}
                        <div className="flex items-center gap-2">
                            {/* Switch Layout Type */}
                            <button
                                type="button"
                                onClick={toggleNoteType}
                                className="p-1.5 rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                                style={{ color: 'var(--text-secondary)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title={editType === 'todo' ? "Switch to Text Note" : "Switch to Checklist"}
                            >
                                {editType === 'todo' ? <AlignLeft size={16} /> : <CheckSquare size={16} />}
                            </button>
                        </div>

                        {/* Save / Cancel actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-85 active:scale-95 text-xs sm:text-sm"
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
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 text-xs sm:text-sm"
                                style={{
                                    backgroundColor: 'var(--accent-color)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                <Check size={14} />
                                <span>Save</span>
                            </button>
                        </div>
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