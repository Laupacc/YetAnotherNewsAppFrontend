import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: [],
};

export const bookmarksSlice = createSlice({
	name: 'bookmarks',
	initialState,
	reducers: {
		addBookmark: (state, action) => {
			state.value.push(action.payload);
		},
		removeBookmark: (state, action) => {
			state.value = state.value.filter(bookmark => bookmark.title !== action.payload.title);
		},
		updateBookmark: (state, action) => {
			state.value = action.payload;
		},
		removeAllBookmark: (state) => {
			state.value = [];
		},
	},
});

export const { addBookmark, removeBookmark, removeAllBookmark, updateBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
