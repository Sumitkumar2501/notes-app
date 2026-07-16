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

    // Load from local storage on mount only (not on every state change)
    useEffect(() => {
        const savedState = localStorage.getItem('noteIt_state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                notesDispatch({ type: 'SET_STATE', payload: { ...parsedState, title: '', text: '' } });
            } catch (error) {
                console.error("Failed to parse local storage data", error);
            }
        }
    }, []); // Fixed: empty array – run only once on mount

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
        <NotesContext.Provider value={{ ...state, notesDispatch, searchQuery, setSearchQuery }}>
            {children}
        </NotesContext.Provider>
    )
}

const useNotes = () => useContext(NotesContext);

export { NotesProvider, useNotes };