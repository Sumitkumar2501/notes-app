import { useNotes } from "../../context/notes-context"
import { findNotesInArchive } from "../../utils/findNotesInArchive";
import { Pin, Archive as ArchiveIcon, Trash2, RefreshCcw, XCircle, Edit2 } from "lucide-react";
import { EditNoteModal } from "../EditNoteModal";
import toast from "react-hot-toast";
import { useState } from "react";

export const NotesCard = ({ id, title, text, isPinned, deletedAt, isTrash, createdAt, updatedAt }) => {
    const { notesDispatch, archive, notes } = useNotes();
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
                text: editedData.text
            }
        });
        toast.success("Note updated successfully");
    };

    // Calculate days left in trash
    const getDaysLeft = () => {
        if (!deletedAt) return 0;
        const diffTime = Math.abs(new Date() - new Date(deletedAt));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = 7 - diffDays;
        return daysLeft > 0 ? daysLeft : 0;
    }

    // Check if note was edited (updatedAt is different from createdAt)
    const isEdited = createdAt && updatedAt && new Date(updatedAt) > new Date(createdAt);

    return (
        <>
            <div className="glass-card p-4 sm:p-5 md:p-6 w-full sm:w-[300px] flex flex-col group relative overflow-hidden animate-fade-in transition-all duration-200 hover:shadow-xl" key={id} style={{ willChange: 'transform', minHeight: '200px' }}>
                {/* Visual Indicators */}
                {isPinned && !isTrash && <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400"></div>}
                {isNotesInArchive && !isTrash && <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400"></div>}
                {isTrash && <div className="absolute top-0 left-0 w-full h-1.5 bg-red-400"></div>}

                {/* Header with Title and Pin Button */}
                <div className="flex justify-between items-start border-b pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2" style={{ borderColor: 'var(--border-primary)' }}>
                    <p className="font-semibold text-base sm:text-lg break-words flex-1 pr-1 leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    {
                        !isNotesInArchive && !isTrash && (
                            <button 
                                onClick={() => onPinClick(id)} 
                                className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95 ${isPinned ? 'bg-yellow-100 text-yellow-600' : ''}`}
                                title={isPinned ? "Unpin note" : "Pin note"}
                                style={!isPinned ? { color: 'var(--text-tertiary)', backgroundColor: 'transparent' } : {}}
                            >
                                <Pin size={16} className="sm:w-[18px] sm:h-[18px]" fill={isPinned ? "currentColor" : "none"} />
                            </button>
                        )
                    }
                </div>
                
                <div className="flex flex-col flex-grow">
                    {/* Content */}
                    <p className="mb-3 sm:mb-4 whitespace-pre-wrap flex-grow text-xs sm:text-sm line-clamp-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    
                    {/* Edited Badge */}
                    {isEdited && !isTrash && (
                        <div className="mb-3 sm:mb-4 text-xs font-medium px-2.5 py-1.5 rounded-md w-fit transition-colors duration-200" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
                            Edited
                        </div>
                    )}

                    {/* Footer with Status and Actions */}
                    <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4 gap-2">
                        {/* Trash Status */}
                        {isTrash ? (
                            <div className="text-xs font-medium px-2.5 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--text-tertiary)' }}>
                                Deletes in {getDaysLeft()}d
                            </div>
                        ) : (
                            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }} />
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1.5 sm:gap-2">
                            {isTrash ? (
                                <>
                                    <button 
                                        onClick={() => onRestoreClick(id)}
                                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                                        title="Restore"
                                    >
                                        <RefreshCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                    <button 
                                        onClick={() => onPermanentDeleteClick(id)}
                                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                        title="Delete Permanently"
                                    >
                                        <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsEditOpen(true)}
                                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(94, 74, 65, 0.1)' }}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                    <button 
                                        onClick={() => onArchiveClick(id)}
                                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95 ${isNotesInArchive ? 'bg-blue-100 text-blue-600' : ''}`}
                                        style={!isNotesInArchive ? { color: 'var(--text-tertiary)', backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                                        title={isNotesInArchive ? "Unarchive" : "Archive"}
                                    >
                                        <ArchiveIcon size={16} className="sm:w-[18px] sm:h-[18px]" fill={isNotesInArchive ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={() => onTrashClick(id)}
                                        className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
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