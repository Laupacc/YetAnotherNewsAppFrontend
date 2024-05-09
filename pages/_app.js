import '../styles/globals.css';
import Head from 'next/head';
import Header from '../components/Header';

import { Provider } from 'react-redux';
import bookmarks from '../reducers/bookmarks';
import user from '../reducers/user';


import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// import storage from 'redux-persist/lib/storage';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const reducers = combineReducers({ bookmarks, user });
const persistConfig = { key: 'yetanothernewsapp', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);


function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Yet Another News App</title>
          <link rel="icon" href="favicon.ico" />
          <meta name="description" content="Yet Another News App where you can find news from all over" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Header />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;

