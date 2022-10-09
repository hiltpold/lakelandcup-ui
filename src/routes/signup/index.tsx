import preact, { FunctionalComponent, h, JSX } from "preact";
import {useState, useEffect, useReducer} from "preact/hooks";
import style from "./style.module.css";

type State = {
  user: string;
  password: string;
  passwordConfirmation: string;
}
 
type Action = { type: "SET_FORM",  payload: {name: string, value: string} }

const formReducer = (state: State, action: Action ) => {
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
}

const Signup: FunctionalComponent = () => {
    const [passwordEquality, setPasswordEquality] = useState<boolean>(true);
    const [formData, setFormData] = useReducer(formReducer, {user:"", password:"", passwordConfirmation:""});
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleChange = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        console.log("change")
        setFormData({
            type: "SET_FORM",
            payload: {name: currentTarget.name, value: currentTarget.value}
        });
    }

    const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        const match = formData.password == formData.passwordConfirmation;
        if (match && formData.password.length > 8) {
            setSubmitting(true);
            setPasswordEquality(match);
            const profile = JSON.stringify({
                    profile: {
                      firstName: "Isaac",
                      lastName: "Brock",
                      email: "isaac.brock@example.com",
                      login: "isaac.brock@example.com",
                    },
                    credentials: {
                        password : { value: "test" }
                }
            });
            console.log(profile);
            /*
            fetch(`https://${config.OKTA_DOMAIN}/api/v1/users?activate=true`, { 
                method: 'post', 
                headers: new Headers({
                   "Accept": "application/json",
                   "Content-Type": "application/json",
                   "Authorization": `SSWS ${config.OKTA_ACCESS_TOKEN}`
                }), 
                body: profile
              });
            */
        } else {
            setPasswordEquality(match);
        }
       
        console.log(event);
        setTimeout(() => {
          setSubmitting(false);
        }, 3000)
    }

    useEffect(() => {
        console.log("<LOGIN>");
        // handle session
    }, []);

    return (
        <div className={`container `}>
            <div className="columns">
                <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.login}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className={`form-label ${style.label}`}>
                                Email
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="user" type="text" placeholder="email" onChange={handleChange} />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Password
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="password" type="password" placeholder="password" onChange={handleChange} />
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="passwordConfirmation" type="password" placeholder="confirm password" onChange={handleChange} />
                                {
                                    (!passwordEquality || formData.password.length < 8) ? <p class="form-input-hint"> Password doe not match or is less than 8 characters! </p> : null
                                }
                            </label>
                            </label>
                            <label className="form-label"> 
                                <button className="btn">
                                    Register
                                </button>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Signup;