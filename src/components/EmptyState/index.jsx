import { Inbox } from 'lucide-react';

export const EmptyState = ({ message, icon: Icon = Inbox }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-[50vh] sm:h-[60vh] animate-fade-in" style={{ color: 'var(--text-tertiary)' }}>
            <div className="p-4 sm:p-6 rounded-full mb-3 sm:mb-4 transition-transform duration-300" style={{ backgroundColor: 'var(--bg-hover)' }}>
                <Icon size={40} className="sm:w-[48px] sm:h-[48px]" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-center px-4" style={{ color: 'var(--text-secondary)' }}>{message}</h3>
        </div>
    );
};
