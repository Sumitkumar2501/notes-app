import { Fragment, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { SideBar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { useNotes } from "../../context/notes-context";
import { NotesCard } from "../../components/NotesCard";
import { EmptyState } from "../../components/EmptyState";
import { SortDropdown } from "../../components/SortDropdown";
import { Star } from "lucide-react";
import { sortNotes } from "../../utils/sortNotes";

export const Important = () => {
    const { notes, searchQuery } = useNotes();
    const [sortBy, setSortBy] = useState('newest');
    
    const importantNotes = notes?.filter(note => note.isPinned && 
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         note.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const sortedImportantNotes = sortNotes(importantNotes, sortBy);

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
                                    <Star className="text-yellow-500 w-5 sm:w-6 h-5 sm:h-6" />
                                    Important Notes
                                </h2>
                                {sortedImportantNotes?.length > 0 && (
                                    <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Notes container with scrolling on mobile */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-8 lg:p-10 pb-24 sm:pb-20 md:pb-4">
                        <div className="max-w-7xl mx-auto">
                            {sortedImportantNotes?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 animate-slide-up auto-rows-max">
                                    {sortedImportantNotes.map(({ id, title, text, isPinned, createdAt, updatedAt }) => (
                                        <NotesCard key={id} id={id} title={title} text={text} isPinned={isPinned} createdAt={createdAt} updatedAt={updatedAt} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No important notes found." icon={Star} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <MobileNav />
        </Fragment>
    );
};
