import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Archive } from './pages/Archive';
import { Important } from './pages/Important';
import { Trash } from './pages/Trash';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            maxWidth: '90vw',
            animation: 'toast-slide-in 0.3s ease-out forwards',
          },
          success: {
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            },
            icon: '✓',
          },
          error: {
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            },
            icon: '✕',
          },
          duration: 3000,
        }} 
        containerStyle={{
          position: 'fixed',
          // Mobile: above bottom nav (h-16 = 64px) with safe area
          // md and up: bottom-right positioning
          bottom: 'calc(64px + 16px + max(env(safe-area-inset-bottom), 8px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 32px)',
          transition: 'bottom 0.3s ease-in-out',
        }}
        containerClassName="toast-container"
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/archive' element={<Archive />} />
        <Route path='/important' element={<Important />} />
        <Route path='/bin' element={<Trash />} />
      </Routes>
    </>
  );
}

export default App;
