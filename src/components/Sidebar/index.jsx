import { NavLink } from 'react-router-dom';
import { Home, Archive, Star, Trash2 } from 'lucide-react';
import { memo } from 'react';

const SideBarComponent = () => {
    const navItems = [
        { to: '/', icon: Home, label: 'Notes' },
        { to: '/important', icon: Star, label: 'Important' },
        { to: '/archive', icon: Archive, label: 'Archive' },
        { to: '/bin', icon: Trash2, label: 'Trash' }
    ];

    return (
        <aside className='hidden md:flex flex-col gap-1 w-64 h-[calc(100vh-73px)] p-3 sticky top-[73px] overflow-y-auto' style={{ backgroundColor: 'var(--bg-secondary)', transition: 'background-color 0.3s ease-in-out' }}>
            {navItems.map((item) => (
                <NavLink 
                    key={item.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium active:scale-95"
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                        boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.06)' : 'none',
                        transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                        opacity: 1,
                        transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out'
                    })}
                    to={item.to}
                    title={item.label}
                >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                </NavLink>
            ))}
        </aside>
    );
};

export const SideBar = memo(SideBarComponent);