import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import { store } from "./app/store.js"
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import "./index.css";

axios.defaults.withCredentials = true;


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
