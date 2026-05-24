/**
 * Sort notes based on the sort option
 * @param {Array} notes - Array of notes to sort
 * @param {string} sortBy - Sort option (newest, oldest, updated, alphabetical)
 * @returns {Array} - Sorted array of notes
 */
export const sortNotes = (notes, sortBy = 'newest') => {
    if (!notes || notes.length === 0) return notes;

    const notesCopy = [...notes];

    switch (sortBy) {
        case 'oldest':
            return notesCopy.sort((a, b) => 
                new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            );
        
        case 'updated':
            return notesCopy.sort((a, b) => 
                new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
            );
        
        case 'alphabetical':
            return notesCopy.sort((a, b) => 
                (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase())
            );
        
        case 'newest':
        default:
            return notesCopy.sort((a, b) => 
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
    }
};
