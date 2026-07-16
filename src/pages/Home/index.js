import { Navbar } from "../../components/Navbar";
import { SideBar } from "../../components/Sidebar";
import { MobileNav } from "../../components/MobileNav";
import { NotesCard } from "../../components/NotesCard";
import { EmptyState } from "../../components/EmptyState";
import { SortDropdown } from "../../components/SortDropdown";
import { Fragment, useState } from 'react';
import { useNotes } from "../../context/notes-context";
import { Plus, CheckSquare, AlignLeft, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { sortNotes } from "../../utils/sortNotes";

// Helper to extract #hashtags from text
const extractHashtags = (text) => {
    if (!text) return [];
    const regex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
            tags.push(match[1].toLowerCase());
        }
    }
    return tags;
};

export const Home = () => {
    const { title, text, notes, searchQuery, selectedTag, setSelectedTag, notesDispatch } = useNotes();
    const [sortBy, setSortBy] = useState('newest');

    // Creator local states for dynamic visual updates
    const [localType, setLocalType] = useState('text');
    const [localTodos, setLocalTodos] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [localTags, setLocalTags] = useState([]);

    const isAddDisabled = !title?.trim();

    const onTitleChange = (e) => {
        notesDispatch({ type: 'TITLE', payload: e.target.value })
    }
    
    const onTextChange = (e) => {
        notesDispatch({ type: 'TEXT', payload: e.target.value })
    }

    // Toggle checklist mode
    const toggleNoteType = () => {
        const newType = localType === 'text' ? 'todo' : 'text';
        setLocalType(newType);
        if (newType === 'todo' && localTodos.length === 0) {
            setLocalTodos([{ id: Date.now().toString(), text: '', isCompleted: false }]);
        }
    };

    // Checklist action handlers
    const handleTodoTextChange = (id, newText) => {
        setLocalTodos(localTodos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    };

    const addTodoItem = () => {
        setLocalTodos([...localTodos, { id: Date.now().toString(), text: '', isCompleted: false }]);
    };

    const removeTodoItem = (id) => {
        setLocalTodos(localTodos.filter(todo => todo.id !== id));
    };

    const toggleTodoCheck = (id) => {
        setLocalTodos(localTodos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    };

    const handleTodoKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodoItem();
        }
    };

    // Explicit tag management
    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.type === 'click') {
            e.preventDefault();
            const val = tagInput.trim().toLowerCase().replace('#', '');
            if (val && !localTags.includes(val)) {
                setLocalTags([...localTags, val]);
            }
            setTagInput('');
        }
    };

    const handleAddTagOnBlur = () => {
        const val = tagInput.trim().toLowerCase().replace('#', '');
        if (val && !localTags.includes(val)) {
            setLocalTags([...localTags, val]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setLocalTags(localTags.filter(t => t !== tagToRemove));
    };

    const onAddClick = () => {
        // Collect tags (explicit + detected hashtags)
        let finalTags = [...localTags];
        const trimmedTag = tagInput.trim().toLowerCase().replace('#', '');
        if (trimmedTag && !finalTags.includes(trimmedTag)) {
            finalTags.push(trimmedTag);
        }
        const textTags = extractHashtags(text);
        const titleTags = extractHashtags(title);
        [...textTags, ...titleTags].forEach(t => {
            if (!finalTags.includes(t)) {
                finalTags.push(t);
            }
        });

        // Parse content
        let finalBodyText = text;
        let validTodos = [];
        if (localType === 'todo') {
            validTodos = localTodos.filter(t => t.text.trim() !== '');
            // String representation for search & compatibility
            finalBodyText = validTodos.map(t => `- [${t.isCompleted ? 'x' : ' '}] ${t.text}`).join('\n');
        }

        notesDispatch({ 
            type: 'ADD_NOTE', 
            payload: {
                title,
                text: finalBodyText,
                color: 'default',
                type: localType,
                todos: validTodos,
                tags: finalTags
            } 
        });

        notesDispatch({ type: 'CLEAR_INPUT' });
        
        // Reset local states
        setLocalType('text');
        setLocalTodos([]);
        setLocalTags([]);
        setTagInput('');
        toast.success("Note added successfully");
    }

    // Filter by search query AND active label tag
    const filteredNotes = notes?.filter(note => {
        const matchesSearch = 
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            note.text.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
        
        return matchesSearch && matchesTag;
    }) || [];

    const pinnedNotes = sortNotes(filteredNotes.filter(({ isPinned }) => isPinned), sortBy);
    const otherNotes = sortNotes(filteredNotes.filter(({ isPinned }) => !isPinned), sortBy);

    return (
        <Fragment>
            <Navbar />
            <main className="flex">
                <SideBar />
                <div className="flex-1 p-4 sm:p-5 md:p-8 lg:p-10 overflow-y-auto h-[calc(100vh-73px)] pb-24 sm:pb-20 md:pb-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-7xl mx-auto flex flex-col items-center">
                        
                        {/* Note Input Area */}
                        <div 
                            className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-sm md:shadow-md border overflow-hidden mb-6 sm:mb-10 md:mb-12 transition-all duration-300 focus-within:shadow-md md:focus-within:shadow-lg focus-within:border-opacity-80 note-default" 
                            style={{ 
                                transition: 'background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.3s' 
                            }}
                        >
                            <input 
                                id="note-title" 
                                name="title" 
                                value={title} 
                                onChange={onTitleChange}
                                className="w-full p-3 sm:p-4 text-sm sm:text-base font-semibold focus:outline-none placeholder-opacity-70 transition-colors duration-200 bg-transparent"
                                placeholder="Title"
                                style={{ color: 'var(--text-primary)', borderBottom: `1px solid rgba(0,0,0,0.06)`, minHeight: '48px', display: 'flex', alignItems: 'center' }}
                            />
                            
                            {/* Conditional text input vs checklist inputs */}
                            {localType === 'todo' ? (
                                <div className="p-3 sm:p-4 space-y-2 max-h-[250px] overflow-y-auto">
                                    {localTodos.map((todo, index) => (
                                        <div key={todo.id} className="flex items-center gap-2.5 animate-fade-in">
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
                                                autoFocus={index === localTodos.length - 1 && localTodos.length > 1}
                                            />
                                            {localTodos.length > 1 && (
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
                                        className="text-xs font-semibold py-1.5 px-3 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 flex items-center gap-1 mt-1.5"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <Plus size={13} /> Add list item
                                    </button>
                                </div>
                            ) : (
                                <textarea 
                                    id="note-text" 
                                    name="text" 
                                    value={text} 
                                    onChange={onTextChange}
                                    className="w-full p-3 sm:p-4 min-h-[100px] sm:min-h-[120px] focus:outline-none resize-none placeholder-opacity-70 transition-colors duration-200 bg-transparent leading-relaxed text-sm"
                                    placeholder="Take a note... (Use #hashtags to automatically add labels!)"
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                            )}

                            {/* Creator Tags Input Tray */}
                            <div className="px-3 sm:px-4 py-2 border-t flex flex-wrap items-center gap-1.5 bg-black/[0.01]" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                                {localTags.map(tag => (
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
                                    placeholder="+ Label"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    onBlur={handleAddTagOnBlur}
                                    className="text-xs bg-transparent focus:outline-none placeholder-opacity-50 min-h-[26px] flex-grow max-w-[120px]"
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                            </div>

                            {/* Creator Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-4 py-2.5 border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                                <div className="flex items-center gap-2">
                                    {/* Note Type Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={toggleNoteType}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation"
                                        style={{ color: 'var(--text-secondary)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={localType === 'todo' ? "Switch to Text Note" : "Switch to Checklist"}
                                    >
                                        {localType === 'todo' ? <AlignLeft size={16} /> : <CheckSquare size={16} />}
                                    </button>
                                </div>

                                <button 
                                    disabled={isAddDisabled} 
                                    onClick={onAddClick} 
                                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-white font-semibold text-xs sm:text-sm rounded-full hover:opacity-85 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 touch-manipulation"
                                    style={{ backgroundColor: 'var(--accent-color)', minHeight: '36px' }}
                                >
                                    <Plus size={15} />
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>

                        {/* Notes Display */}
                        <div className="w-full">
                            {filteredNotes.length === 0 ? (
                                searchQuery || selectedTag ? (
                                    <EmptyState message={`No notes found for current filters`} />
                                ) : (
                                    <EmptyState message="Notes you add appear here" />
                                )
                            ) : (
                                <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
                                    {/* Sort and Tag Filter Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                                        {/* Label Tag Filter Banner */}
                                        {selectedTag ? (
                                            <div className="flex items-center gap-1.5 animate-fade-in">
                                                <span 
                                                    className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5" 
                                                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', border: '1px solid var(--border-primary)' }}
                                                >
                                                    <Hash size={12} />
                                                    {selectedTag}
                                                    <button 
                                                        onClick={() => setSelectedTag(null)} 
                                                        className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                                                        title="Clear filter"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                        
                                        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                                    </div>

                                    {pinnedNotes.length > 0 && (
                                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                                            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-5 md:mb-6 ml-1" style={{ color: 'var(--text-tertiary)' }}>Pinned</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 auto-rows-max">
                                                {pinnedNotes.map((note) => (
                                                    <NotesCard key={note.id} {...note} />
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                    
                                    {otherNotes.length > 0 && (
                                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                                            {pinnedNotes.length > 0 && <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-5 md:mb-6 ml-1" style={{ color: 'var(--text-tertiary)' }}>Others</h3>}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 auto-rows-max">
                                                {otherNotes.map((note) => (
                                                    <NotesCard key={note.id} {...note} />
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </main>
            <MobileNav />
        </Fragment>
    )
}