import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.module.css';

const Notfound: FunctionalComponent = () => {
    return (
        <div className={`container grid-md`}>
            <div className={style.notfound} >
                <h1>Error 404</h1>
                <p>That page doesn&apos;t exist.</p>
                <Link href="/">
                    <h4>Home</h4>
                </Link>
            </div>
        </div>
    );
};

export default Notfound;
