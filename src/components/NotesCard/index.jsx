import { useNotes } from "../../context/notes-context"
import { findNotesInArchive } from "../../utils/findNotesInArchive";
import { Pin, Archive as ArchiveIcon, Trash2, RefreshCcw, XCircle, Edit2, Clock, CheckSquare } from "lucide-react";
import { EditNoteModal } from "../EditNoteModal";
import { formatNoteDate } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { useState } from "react";

export const NotesCard = ({ id, title, text, isPinned, deletedAt, isTrash, createdAt, updatedAt, type = 'text', todos = [], tags = [] }) => {
    const { notesDispatch, archive, notes, fontFamily, selectedTag, setSelectedTag } = useNotes();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isNotesInArchive = findNotesInArchive(archive, id);

    // Get current note for modal
    const currentNote = notes?.find(n => n.id === id) || archive?.find(n => n.id === id);

    const onPinClick = (id) => {
        if (!isPinned) {
            notesDispatch({ type: 'PIN', payload: { id } });
            toast.success("Note pinned");
        } else {
            notesDispatch({ type: 'UNPIN', payload: { id } });
            toast.success("Note unpinned");
        }
    }

    const onArchiveClick = (id) => {
        if (!isNotesInArchive) {
            notesDispatch({ type: 'ADD_TO_ARCHIVE', payload: { id } });
            toast.success("Note archived");
        } else {
            notesDispatch({ type: 'REMOVE_FROM_ARCHIVE', payload: { id } });
            toast.success("Removed from archive");
        }
    }

    const onTrashClick = (id) => {
        notesDispatch({ type: 'MOVE_TO_TRASH', payload: { id } });
        toast.error("Note moved to trash");
    }

    const onRestoreClick = (id) => {
        notesDispatch({ type: 'RESTORE_FROM_TRASH', payload: { id } });
        toast.success("Note restored");
    }

    const onPermanentDeleteClick = (id) => {
        notesDispatch({ type: 'DELETE_PERMANENTLY', payload: { id } });
        toast.success("Note deleted permanently");
    }

    const onEditSave = (editedData) => {
        notesDispatch({
            type: 'EDIT_NOTE',
            payload: {
                id,
                title: editedData.title,
                text: editedData.text,
                type: editedData.type,
                todos: editedData.todos,
                tags: editedData.tags
            }
        });
        toast.success("Note updated successfully");
    };

    // Stable, consistent tilt angle based on note ID hash
    const getRotation = (noteId) => {
        if (!noteId) return 0;
        let hash = 0;
        for (let i = 0; i < noteId.length; i++) {
            hash = noteId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const val = (hash % 24) / 10; // value between -2.4 and 2.4
        return (val * 0.5).toFixed(1); // scale to -1.2 to 1.2 degrees
    }

    const cardRotation = !isTrash ? getRotation(id) : 0;

    // Calculate days left in trash
    const getDaysLeft = () => {
        if (!deletedAt) return 0;
        const diffTime = Math.abs(new Date() - new Date(deletedAt));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = 7 - diffDays;
        return daysLeft > 0 ? daysLeft : 0;
    }

    // Check if note was edited
    const isEdited = createdAt && updatedAt && new Date(updatedAt) > new Date(createdAt);

    return (
        <>
            <div 
                className="glass-card p-3 sm:p-5 md:p-6 w-full sm:w-[300px] flex flex-col group relative overflow-hidden animate-fade-in transition-all duration-200 hover:shadow-xl rotate-note paper-texture note-default" 
                key={id} 
                style={{ 
                    willChange: 'transform', 
                    minHeight: '220px',
                    transform: `rotate(${cardRotation}deg)`
                }}
            >
                {/* 3D Pushpin for Pinned Notes */}
                {isPinned && !isTrash && (
                    <div className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 z-10 drop-shadow-[0_3px_2px_rgba(0,0,0,0.15)] pointer-events-none pushpin-animate transition-transform duration-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-[-12deg]">
                            {/* Pin cap shadow */}
                            <path d="M12 21L14 22.5L12 23L10 22.5L12 21Z" fill="#000000" opacity="0.3" />
                            {/* Pin cap */}
                            <path d="M7 6C7 3.2 9.2 1 12 1C14.8 1 17 3.2 17 6C17 7.7 16.1 9.2 14.8 10.1L15.5 12H8.5L9.2 10.1C7.9 9.2 7 7.7 7 6Z" fill="#ef4444" />
                            <ellipse cx="12" cy="4.5" rx="3" ry="1.2" fill="#fca5a5" opacity="0.6" />
                            {/* Metal collar */}
                            <path d="M10.5 12H13.5V14H10.5V12Z" fill="#d1d5db" />
                            {/* Metal spike */}
                            <path d="M11.8 14H12.2V20H11.8V14Z" fill="#9ca3af" />
                            <path d="M12 20L11.5 21L12 21.5L12.5 21L12 20Z" fill="#4b5563" />
                        </svg>
                    </div>
                )}

                {/* Top border colored highlights */}
                {isPinned && !isTrash && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>}
                {isNotesInArchive && !isTrash && <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>}
                {isTrash && <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>}

                {/* Header with Title and Pin Button */}
                <div className="flex justify-between items-start border-b pb-2 sm:pb-3 mb-3 gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <p className={`font-bold text-sm sm:text-base break-words flex-1 pr-1 leading-tight font-${fontFamily}-note`} style={{ color: 'var(--text-primary)' }}>{title}</p>
                    {
                        !isNotesInArchive && !isTrash && (
                            <button 
                                onClick={() => onPinClick(id)} 
                                className={`flex-shrink-0 p-1.5 sm:p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 ${isPinned ? 'bg-yellow-100/50 text-yellow-600' : ''}`}
                                title={isPinned ? "Unpin note" : "Pin note"}
                                style={!isPinned ? { color: 'var(--text-tertiary)', backgroundColor: 'transparent' } : {}}
                            >
                                <Pin size={15} className="sm:w-[16px] sm:h-[16px]" fill={isPinned ? "currentColor" : "none"} />
                            </button>
                        )
                    }
                </div>
                
                <div className="flex flex-col flex-grow">
                    {/* Content (Text vs Checklist) */}
                    {type === 'todo' ? (
                        <div className={`mb-3 sm:mb-4 flex-grow space-y-1.5 font-${fontFamily}-note`} style={{ color: 'var(--text-secondary)' }}>
                            {(todos || []).slice(0, 6).map(todo => (
                                <label 
                                    key={todo.id} 
                                    className="flex items-start gap-2 cursor-pointer text-xs sm:text-sm py-0.5 select-none"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        checked={todo.isCompleted}
                                        disabled={isTrash}
                                        onChange={() => {
                                            if (!isTrash) {
                                                notesDispatch({ 
                                                    type: 'TOGGLE_TODO', 
                                                    payload: { noteId: id, todoId: todo.id } 
                                                });
                                            }
                                        }}
                                        className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                                        style={{ accentColor: 'var(--accent-color)' }}
                                    />
                                    <span className={`break-all leading-tight ${todo.isCompleted ? 'line-through opacity-40' : ''}`}>
                                        {todo.text}
                                    </span>
                                </label>
                            ))}
                            {todos?.length > 6 && (
                                <div className="text-[10px] font-semibold italic pl-6 mt-1 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                    <CheckSquare size={10} />
                                    <span>+ {todos.length - 6} more tasks</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className={`mb-3 sm:mb-4 whitespace-pre-wrap flex-grow text-xs sm:text-sm line-clamp-6 leading-relaxed font-${fontFamily}-note`} style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    )}
                    
                    {/* Tags List */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {tags.map(tag => {
                                const isTagSelected = selectedTag === tag;
                                return (
                                    <span 
                                        key={tag} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isTrash) {
                                                setSelectedTag(isTagSelected ? null : tag);
                                            }
                                        }}
                                        className={`text-[9px] font-semibold px-2 py-0.5 rounded transition-all duration-150 ${!isTrash ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''}`}
                                        style={{ 
                                            backgroundColor: isTagSelected ? 'var(--accent-light)' : 'rgba(0, 0, 0, 0.05)', 
                                            color: isTagSelected ? 'var(--accent-color)' : 'var(--text-secondary)',
                                            border: isTagSelected ? '1px solid var(--accent-color)' : '1px solid rgba(0, 0, 0, 0.03)'
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Edited Badge */}
                    {isEdited && !isTrash && (
                        <div className="mb-3 text-[10px] font-semibold px-2 py-0.5 rounded w-fit transition-colors duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-tertiary)' }}>
                            Edited
                        </div>
                    )}

                    {/* Timestamp Info */}
                    {createdAt && (
                        <div className="mb-3 flex items-center gap-1.5 text-[10px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            <Clock size={11} />
                            <span className="flex flex-col sm:flex-row sm:gap-1">
                                <span>{formatNoteDate(createdAt).date}</span>
                                <span className="hidden sm:inline">·</span>
                                <span>{formatNoteDate(createdAt).time}</span>
                            </span>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-auto flex items-center justify-between pt-2.5 border-t gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        {/* Trash Status */}
                        {isTrash ? (
                            <div className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--text-tertiary)' }}>
                                {getDaysLeft()}d left
                            </div>
                        ) : (
                            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }} />
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                            {isTrash ? (
                                <>
                                    <button 
                                        onClick={() => onRestoreClick(id)}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(16, 185, 129, 0.1)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Restore"
                                    >
                                        <RefreshCcw size={14} />
                                    </button>
                                    <button 
                                        onClick={() => onPermanentDeleteClick(id)}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(239, 68, 68, 0.1)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Delete Permanently"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsEditOpen(true)}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(94, 74, 65, 0.1)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Edit Note"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => onArchiveClick(id)}
                                        className={`p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation ${isNotesInArchive ? 'bg-blue-100 text-blue-600' : ''}`}
                                        style={!isNotesInArchive ? { color: 'var(--text-tertiary)', backgroundColor: 'rgba(59, 130, 246, 0.1)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' } : { minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={isNotesInArchive ? "Unarchive" : "Archive"}
                                    >
                                        <ArchiveIcon size={14} fill={isNotesInArchive ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={() => onTrashClick(id)}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-85 active:scale-95 touch-manipulation"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(239, 68, 68, 0.1)', minHeight: '34px', minWidth: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Delete Note"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {currentNote && (
                <EditNoteModal
                    note={currentNote}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={onEditSave}
                />
            )}
        </>
    )
}