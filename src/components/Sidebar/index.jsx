import { NavLink } from 'react-router-dom';
import { Home, Archive, Star, Trash2, Hash } from 'lucide-react';
import { memo } from 'react';
import { useNotes } from '../../context/notes-context';

const SideBarComponent = () => {
    const { notes, archive, selectedTag, setSelectedTag } = useNotes();

    const navItems = [
        { to: '/', icon: Home, label: 'Notes' },
        { to: '/important', icon: Star, label: 'Important' },
        { to: '/archive', icon: Archive, label: 'Archive' },
        { to: '/bin', icon: Trash2, label: 'Trash' }
    ];

    // Dynamic aggregation of unique tags
    const allActiveNotes = [...(notes || []), ...(archive || [])];
    const tagCounts = allActiveNotes.reduce((acc, note) => {
        if (note.tags && Array.isArray(note.tags)) {
            note.tags.forEach(tag => {
                if (tag && tag.trim()) {
                    acc[tag.trim()] = (acc[tag.trim()] || 0) + 1;
                }
            });
        }
        return acc;
    }, {});

    const uniqueTags = Object.keys(tagCounts).sort();

    return (
        <aside className='hidden md:flex flex-col gap-1 w-64 h-[calc(100vh-73px)] p-3 sticky top-[73px] overflow-y-auto safe-area-inset-left border-r' style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out', paddingLeft: 'max(12px, calc(12px + env(safe-area-inset-left)))' }}>
            {/* Nav Pages */}
            <div className="flex flex-col gap-1 mb-6">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.to}
                        className="flex items-center justify-between px-4 py-3 rounded-lg font-medium active:scale-95"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                            color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                            boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.06)' : 'none',
                            transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                            opacity: 1,
                            transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out'
                        })}
                        to={item.to}
                        onClick={() => setSelectedTag(null)} // Clear tag filter when changing pages
                        title={item.label}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className="flex-shrink-0" />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </NavLink>
                ))}
            </div>

            {/* Labels/Tags section */}
            {uniqueTags.length > 0 && (
                <div className="flex flex-col gap-1 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center justify-between px-4 py-1 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-tertiary" style={{ color: 'var(--text-tertiary)' }}>Labels</span>
                        {selectedTag && (
                            <button 
                                onClick={() => setSelectedTag(null)}
                                className="text-[10px] font-bold hover:underline"
                                style={{ color: 'var(--accent-color)' }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {uniqueTags.map(tag => {
                        const isTagSelected = selectedTag === tag;
                        return (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium active:scale-95 transition-all duration-200 w-full text-left"
                                style={{
                                    backgroundColor: isTagSelected ? 'var(--accent-light)' : 'transparent',
                                    color: isTagSelected ? 'var(--accent-color)' : 'var(--text-secondary)',
                                    transform: isTagSelected ? 'translateX(2px)' : 'translateX(0)',
                                }}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Hash size={16} className={`flex-shrink-0 ${isTagSelected ? 'text-indigo-500' : 'text-slate-400'}`} style={{ color: isTagSelected ? 'var(--accent-color)' : 'var(--text-tertiary)' }} />
                                    <span className="truncate">{tag}</span>
                                </div>
                                <span 
                                    className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0"
                                    style={{
                                        backgroundColor: isTagSelected ? 'var(--accent-color)' : 'var(--bg-hover)',
                                        color: isTagSelected ? '#ffffff' : 'var(--text-tertiary)'
                                    }}
                                >
                                    {tagCounts[tag]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </aside>
    );
};

export const SideBar = memo(SideBarComponent);