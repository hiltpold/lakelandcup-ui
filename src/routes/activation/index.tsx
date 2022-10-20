import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.module.css';

const Activation: FunctionalComponent = () => {
    return (
        <div className={`container grid-md`}>
            <div className={style.activation} >
                <p>The activation link has been sent to the email provided using the registration. If you did no receive an activation link or the link is outdated, use the form below to resend the link.</p>
                <div className="columns">
                    <div className={`column col-5 col-mx-auto col-xs-12 col-lg-6`}>
                        <div className="form-group">
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" type="text" placeholder="email" onChange={()=>{}} />
                            </label>
                            <label className="form-label"> 
                                <button className="btn" onClick={()=>{}} >
                                    Submit
                                </button>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activation;
