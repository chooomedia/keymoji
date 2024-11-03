import Root from './index.svelte';
import './index.css';

export default new Root({
    target: document.body,
    props: {
        url: window.location.pathname
    }
});