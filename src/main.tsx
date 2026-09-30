import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const adUrl = 'https://omg10.com/4/11922745';

document.addEventListener('click', (event) => {
	if (!(event.target instanceof Element)) return;

	const clickable = event.target.closest('[data-ad-trigger]');

	if (!clickable || clickable.matches(':disabled, [aria-disabled="true"]')) return;

	window.open(adUrl, '_blank', 'noopener,noreferrer');
}, true);

createRoot(document.getElementById('root')!).render(<App />);
