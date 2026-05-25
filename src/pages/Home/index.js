import { Navbar } from "../../components/Navbar";
import { SideBar } from "../../components/Sidebar";
import { MobileNav } from "../../components/MobileNav";
import { NotesCard } from "../../components/NotesCard";
import { EmptyState } from "../../components/EmptyState";
import { SortDropdown } from "../../components/SortDropdown";
import { Fragment, useState } from 'react';
import { useNotes } from "../../context/notes-context";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { sortNotes } from "../../utils/sortNotes";

export const Home = () => {

    const { title, text, notes, searchQuery, notesDispatch } = useNotes();
    const [sortBy, setSortBy] = useState('newest');

    const onTitleChange = (e) => {
        notesDispatch({ type: 'TITLE', payload: e.target.value })
    }
    
    const onTextChange = (e) => {
        notesDispatch({ type: 'TEXT', payload: e.target.value })
    }

    const onAddClick = () => {
        notesDispatch({ type: 'ADD_NOTE' })
        notesDispatch({ type: 'CLEAR_INPUT' })
        toast.success("Note added successfully");
    }

    // Filter by search query
    const filteredNotes = notes?.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const pinnedNotes = sortNotes(filteredNotes.filter(({ isPinned }) => isPinned), sortBy);
    const otherNotes = sortNotes(filteredNotes.filter(({ isPinned }) => !isPinned), sortBy);

    return (
        <Fragment>
            <Navbar />
            <main className="flex">
                <SideBar />
                <div className="flex-1 p-4 sm:p-5 md:p-8 lg:p-10 overflow-y-auto h-[calc(100vh-73px)] md:h-[calc(100vh-73px)] pb-24 sm:pb-20 md:pb-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-7xl mx-auto flex flex-col items-center">
                        
                        {/* Note Input Area */}
                        <div className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-sm md:shadow-md border overflow-hidden mb-6 sm:mb-10 md:mb-12 transition-all duration-300 focus-within:shadow-md md:focus-within:shadow-lg focus-within:border-opacity-80" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-md)' }}>
                            <input 
                                id="note-title" 
                                name="title" 
                                value={title} 
                                onChange={onTitleChange}
                                className="w-full p-3 sm:p-4 text-sm sm:text-lg font-semibold focus:outline-none placeholder-opacity-70 transition-colors duration-200"
                                placeholder="Title"
                                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderBottom: `1px solid var(--border-primary)`, minHeight: '48px', display: 'flex', alignItems: 'center' }}
                            />
                            <textarea 
                                id="note-text" 
                                name="text" 
                                value={text} 
                                onChange={onTextChange}
                                className="w-full p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] focus:outline-none resize-none placeholder-opacity-70 transition-colors duration-200"
                                placeholder="Take a note..."
                                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }}
                            />
                            <div className="flex justify-end p-3 sm:p-4 border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                                <button 
                                    disabled={!title?.trim()} 
                                    onClick={onAddClick} 
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2.5 text-white font-medium text-xs sm:text-base rounded-full hover:opacity-85 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 touch-manipulation"
                                    style={{ backgroundColor: 'var(--accent-color)', minHeight: '40px' }}
                                >
                                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    <span>Add Note</span>
                                </button>
                            </div>
                        </div>

                        {/* Notes Display */}
                        <div className="w-full">
                            {filteredNotes.length === 0 ? (
                                searchQuery ? (
                                    <EmptyState message={`No notes found for "${searchQuery}"`} />
                                ) : (
                                    <EmptyState message="Notes you add appear here" />
                                )
                            ) : (
                                <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
                                    {/* Sort Dropdown */}
                                    <div className="flex justify-end px-1">
                                        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                                    </div>

                                    {pinnedNotes.length > 0 && (
                                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                                            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-5 md:mb-6 ml-1" style={{ color: 'var(--text-tertiary)' }}>Pinned</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 auto-rows-max">
                                                {pinnedNotes.map(({ id, title, text, isPinned, createdAt, updatedAt }) => (
                                                    <NotesCard key={id} id={id} title={title} text={text} isPinned={isPinned} createdAt={createdAt} updatedAt={updatedAt} />
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                    
                                    {otherNotes.length > 0 && (
                                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                                            {pinnedNotes.length > 0 && <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-5 md:mb-6 ml-1" style={{ color: 'var(--text-tertiary)' }}>Others</h3>}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 auto-rows-max">
                                                {otherNotes.map(({ id, title, text, isPinned, createdAt, updatedAt }) => (
                                                    <NotesCard key={id} id={id} title={title} text={text} isPinned={isPinned} createdAt={createdAt} updatedAt={updatedAt} />
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