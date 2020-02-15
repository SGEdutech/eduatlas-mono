import { BrowserRouter, HashRouter } from 'react-router-dom';

export default window.cordova ? HashRouter : BrowserRouter;
