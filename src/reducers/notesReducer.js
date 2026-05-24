import { v4 as uuid} from 'uuid';

export const notesReducer = (state, {type ,payload})=> {
    switch(type){
        case 'TITLE':
            return{ ...state, title: payload }
        case 'TEXT':
            return{ ...state, text: payload }
        case 'ADD_NOTE':
            const now = new Date().toISOString();
            return{
                ...state,
                notes: [...state.notes, {text:state.text, title: state.title, id: uuid(), isPinned:false, createdAt: now, updatedAt: now}]
            }
        case 'CLEAR_INPUT':
            return{
                ...state,
                title:'',
                text:''
            }
        case 'PIN':
            return{
                ...state,
                notes: state.notes.map(note => note.id === payload.id ? { ...note, isPinned: true, updatedAt: new Date().toISOString() } : note),
                archive: state.archive.map(note => note.id === payload.id ? { ...note, isPinned: true, updatedAt: new Date().toISOString() } : note)
            }
        case 'UNPIN':
            return{
                ...state,
                notes: state.notes.map(note => note.id === payload.id ? { ...note, isPinned: false, updatedAt: new Date().toISOString() } : note),
                archive: state.archive.map(note => note.id === payload.id ? { ...note, isPinned: false, updatedAt: new Date().toISOString() } : note)
            }
        case 'ADD_TO_ARCHIVE':
            return{
                ...state,
                archive: [...state.archive, state.notes.find(({id}) => id === payload.id)],
                notes: state.notes.filter(({id}) => id !== payload.id)
            }    
        case 'REMOVE_FROM_ARCHIVE':
            return{
                ...state,
                notes: [...state.notes, state.archive.find(({id})=> id === payload.id)],
                archive: state.archive.filter(({id})=>id !== payload.id)
            }
        case 'MOVE_TO_TRASH':
            const noteToTrash = state.notes.find(n => n.id === payload.id) || state.archive.find(n => n.id === payload.id);
            if (!noteToTrash) return state;
            return {
                ...state,
                notes: state.notes.filter(n => n.id !== payload.id),
                archive: state.archive.filter(n => n.id !== payload.id),
                trash: [...(state.trash || []), { ...noteToTrash, deletedAt: new Date().toISOString() }]
            }
        case 'RESTORE_FROM_TRASH':
            const noteToRestore = state.trash.find(n => n.id === payload.id);
            if (!noteToRestore) return state;
            const { deletedAt, ...restNote } = noteToRestore; // remove deletedAt
            return {
                ...state,
                trash: state.trash.filter(n => n.id !== payload.id),
                notes: [...state.notes, { ...restNote, updatedAt: new Date().toISOString(), createdAt: restNote.createdAt || new Date().toISOString() }]
            }
        case 'DELETE_PERMANENTLY':
            return {
                ...state,
                trash: state.trash.filter(n => n.id !== payload.id)
            }
        case 'EDIT_NOTE':
            return {
                ...state,
                notes: state.notes.map(note => 
                    note.id === payload.id 
                        ? { ...note, title: payload.title, text: payload.text, updatedAt: new Date().toISOString() } 
                        : note
                ),
                archive: state.archive.map(note => 
                    note.id === payload.id 
                        ? { ...note, title: payload.title, text: payload.text, updatedAt: new Date().toISOString() } 
                        : note
                )
            }
        case 'SET_STATE':
            return {
                ...state,
                ...payload
            }
        default:
            return state;
    }
}