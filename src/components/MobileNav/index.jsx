import { Home, Archive, Star, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { memo } from 'react';

const MobileNavComponent = () => {
    const navItems = [
        { to: '/', icon: Home, label: 'Notes' },
        { to: '/important', icon: Star, label: 'Important' },
        { to: '/archive', icon: Archive, label: 'Archive' },
        { to: '/bin', icon: Trash2, label: 'Trash' }
    ];

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 md:hidden border-t z-40"
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
                boxShadow: 'var(--shadow-lg)',
            }}
        >
            <div className="flex items-center justify-around h-16 sm:h-20">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 relative"
                        style={({ isActive }) => ({
                            color: isActive ? 'var(--accent-color)' : 'var(--text-tertiary)',
                        })}
                        title={item.label}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active indicator line */}
                                {isActive && (
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1"
                                        style={{
                                            backgroundColor: 'var(--accent-color)',
                                            transition: 'background-color 0.3s ease-in-out'
                                        }}
                                    />
                                )}
                                <item.icon size={24} className="sm:w-6 sm:h-6 transition-all duration-200" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export const MobileNav = memo(MobileNavComponent);
