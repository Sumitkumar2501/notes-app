import { v4 as uuid} from 'uuid';

export const notesReducer = (state, {type ,payload})=> {
    switch(type){
        case 'TITLE':
            return{ ...state, title: payload }
        case 'TEXT':
            return{ ...state, text: payload }
        case 'COLOR':
            return{ ...state, color: payload }
        case 'TYPE':
            return{ ...state, type: payload }
        case 'TODOS':
            return{ ...state, todos: payload }
        case 'TAGS':
            return{ ...state, tags: payload }
        case 'ADD_NOTE':
            const now = new Date().toISOString();
            return{
                ...state,
                notes: [...state.notes, {
                    id: uuid(), 
                    isPinned: false, 
                    createdAt: now, 
                    updatedAt: now,
                    title: payload?.title !== undefined ? payload.title : state.title,
                    text: payload?.text !== undefined ? payload.text : state.text,
                    color: payload?.color || state.color || 'default',
                    type: payload?.type || state.type || 'text',
                    todos: payload?.todos || state.todos || [],
                    tags: payload?.tags || state.tags || []
                }]
            }
        case 'CLEAR_INPUT':
            return{
                ...state,
                title:'',
                text:'',
                color: 'default',
                type: 'text',
                todos: [],
                tags: []
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
                        ? { 
                            ...note, 
                            title: payload.title, 
                            text: payload.text, 
                            color: payload.color || note.color || 'default',
                            type: payload.type || note.type || 'text',
                            todos: payload.todos || note.todos || [],
                            tags: payload.tags || note.tags || [],
                            updatedAt: new Date().toISOString() 
                          } 
                        : note
                ),
                archive: state.archive.map(note => 
                    note.id === payload.id 
                        ? { 
                            ...note, 
                            title: payload.title, 
                            text: payload.text, 
                            color: payload.color || note.color || 'default',
                            type: payload.type || note.type || 'text',
                            todos: payload.todos || note.todos || [],
                            tags: payload.tags || note.tags || [],
                            updatedAt: new Date().toISOString() 
                          } 
                        : note
                )
            }
        case 'CHANGE_NOTE_COLOR':
            return {
                ...state,
                notes: state.notes.map(note => note.id === payload.id ? { ...note, color: payload.color, updatedAt: new Date().toISOString() } : note),
                archive: state.archive.map(note => note.id === payload.id ? { ...note, color: payload.color, updatedAt: new Date().toISOString() } : note)
            }
        case 'TOGGLE_TODO':
            const toggleTodoItem = (note) => {
                if (note.id !== payload.noteId) return note;
                return {
                    ...note,
                    todos: (note.todos || []).map(todo => 
                        todo.id === payload.todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
                    ),
                    updatedAt: new Date().toISOString()
                };
            };
            return {
                ...state,
                notes: state.notes.map(toggleTodoItem),
                archive: state.archive.map(toggleTodoItem)
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