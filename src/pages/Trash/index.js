import { Fragment } from 'react';
import { Navbar } from '../../components/Navbar';
import { SideBar } from '../../components/Sidebar';
import { MobileNav } from '../../components/MobileNav';
import { useNotes } from "../../context/notes-context";
import { NotesCard } from "../../components/NotesCard";
import { EmptyState } from "../../components/EmptyState";
import { Trash2 } from "lucide-react";

export const Trash = () => {
    const { trash, searchQuery } = useNotes();
    
    const trashNotes = trash?.filter(note => 
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         note.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Fragment>
            <Navbar />
            <main className="flex">
                <SideBar />
                <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto h-[calc(100vh-73px)] md:h-[calc(100vh-73px)] pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Trash2 className="text-red-500 w-5 sm:w-6 h-5 sm:h-6" />
                                Trash
                            </h2>
                            <p className="text-xs sm:text-sm rounded-full shadow-sm border px-3 py-1.5 whitespace-nowrap" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-primary)' }}>
                                Deleted after 7 days
                            </p>
                        </div>
                        
                        {trashNotes?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10 animate-slide-up auto-rows-max">
                                {trashNotes.map(({ id, title, text, isPinned, deletedAt, createdAt, updatedAt }) => (
                                    <NotesCard 
                                        key={id} 
                                        id={id} 
                                        title={title} 
                                        text={text} 
                                        isPinned={isPinned}
                                        deletedAt={deletedAt}
                                        createdAt={createdAt}
                                        updatedAt={updatedAt}
                                        isTrash={true} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="Trash is empty." icon={Trash2} />
                        )}
                    </div>
                </div>
            </main>
            <MobileNav />
        </Fragment>
    );
};
