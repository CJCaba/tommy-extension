import {createRoot} from 'react-dom/client';
import App from './App';

const container = document.getElementById('react-app');
if (container) {
    const root = createRoot(container);
    root.render(<App/>);
}
