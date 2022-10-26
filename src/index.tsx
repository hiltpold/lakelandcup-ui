import { h, render } from 'preact';
import './style/index.css';
import './style/spectre-icons.css';
import App from './components/app';

const node = document.getElementById('root') as Element;

render(<App/>, document.body);
