import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { notesReducer } from '../reducers/notesReducer';

const NotesContext = createContext();

const NotesProvider = ({children}) => {
    const initialState = {
        title: '',
        text: '',
        notes: [],
        archive: [],
        trash: []
    };

    const [state, notesDispatch] = useReducer(notesReducer, initialState);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [fontFamily, setFontFamily] = useState('sans');

    // Load from local storage on mount only (not on every state change)
    useEffect(() => {
        const savedState = localStorage.getItem('noteIt_state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                
                // Auto-purge notes in trash older than 7 days
                const now = new Date();
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
                const cleanTrash = (parsedState.trash || []).filter(note => {
                    if (!note.deletedAt) return false;
                    const elapsed = now - new Date(note.deletedAt);
                    return elapsed < sevenDaysInMs;
                });

                const cleanedState = {
                    ...parsedState,
                    trash: cleanTrash,
                    title: '',
                    text: ''
                };

                notesDispatch({ type: 'SET_STATE', payload: cleanedState });

                // If notes were auto-purged, sync back to local storage
                if ((parsedState.trash || []).length !== cleanTrash.length) {
                    const { title, text, ...stateToSave } = cleanedState;
                    localStorage.setItem('noteIt_state', JSON.stringify(stateToSave));
                }
            } catch (error) {
                console.error("Failed to parse local storage data", error);
            }
        }
        const savedFont = localStorage.getItem('noteIt_font');
        if (savedFont) {
            setFontFamily(savedFont);
        }
    }, []); // Fixed: empty array – run only once on mount

    const changeFontFamily = (font) => {
        setFontFamily(font);
        localStorage.setItem('noteIt_font', font);
    };

    // Save to local storage only when notes/archive/trash change
    useEffect(() => {
        const stateToSave = {
            notes: state.notes,
            archive: state.archive,
            trash: state.trash
        };
        localStorage.setItem('noteIt_state', JSON.stringify(stateToSave));
    }, [state.notes, state.archive, state.trash]); // Fixed: no direct reference to `state` object

    return (
        <NotesContext.Provider value={{ 
            ...state, 
            notesDispatch, 
            searchQuery, 
            setSearchQuery,
            selectedTag,
            setSelectedTag,
            fontFamily,
            setFontFamily: changeFontFamily
        }}>
            {children}
        </NotesContext.Provider>
    )
}

const useNotes = () => useContext(NotesContext);

export { NotesProvider, useNotes };