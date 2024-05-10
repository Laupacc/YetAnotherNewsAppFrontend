import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: [],
};

export const bookmarksSlice = createSlice({
	name: 'bookmarks',
	initialState,
	reducers: {
		addBookmark: (state, action) => {
			if (!state.value) {
				state.value = []; // Initialize state.value if it's undefined
			}
			state.value.push(action.payload);
		},
		removeBookmark: (state, action) => {
			state.value = state.value.filter(bookmark => bookmark.title !== action.payload.title);
		},
		// updateBookmark: (state, action) => {
		// 	state.value = [...state.value, ...action.payload];
		// },
		removeAllBookmark: (state) => {
			state.value = [];
		},
	},
});

export const { addBookmark, removeBookmark, removeAllBookmark, updateBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
