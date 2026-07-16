import { Fragment, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { SideBar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { useNotes } from "../../context/notes-context";
import { NotesCard } from "../../components/NotesCard";
import { EmptyState } from "../../components/EmptyState";
import { SortDropdown } from "../../components/SortDropdown";
import { Archive as ArchiveIcon, Hash } from "lucide-react";
import { sortNotes } from "../../utils/sortNotes";

export const Archive = () => {
    const { archive, searchQuery, selectedTag, setSelectedTag } = useNotes();
    const [sortBy, setSortBy] = useState('newest');

    const archiveNotes = archive?.filter(note => {
        const matchesSearch = 
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            note.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
        
        return matchesSearch && matchesTag;
    }) || [];

    const sortedArchiveNotes = sortNotes(archiveNotes, sortBy);

    return (
        <Fragment>
            <Navbar />
            <main className="flex">
                <SideBar />
                <div className="flex-1 flex flex-col h-[calc(100vh-73px)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    {/* Mobile: Sort bar in normal flow; Desktop: regular layout */}
                    <div className="flex-shrink-0 p-4 sm:p-5 md:p-8 lg:p-10 overflow-visible">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 sm:mb-0">
                                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <ArchiveIcon className="text-blue-500 w-5 sm:w-6 h-5 sm:h-6" />
                                    Archived Notes
                                </h2>
                                {sortedArchiveNotes?.length > 0 && (
                                    <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Notes container with scrolling on mobile */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-8 lg:p-10 pb-24 sm:pb-20 md:pb-4">
                        <div className="max-w-7xl mx-auto">
                            {/* Label Tag Filter Banner */}
                            {selectedTag && (
                                <div className="flex items-center gap-1.5 mb-6 animate-fade-in">
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
                            )}

                            {sortedArchiveNotes?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 animate-slide-up auto-rows-max">
                                    {sortedArchiveNotes.map((note) => (
                                        <NotesCard key={note.id} {...note} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No archived notes found." icon={ArchiveIcon} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <MobileNav />
        </Fragment>
    )
}