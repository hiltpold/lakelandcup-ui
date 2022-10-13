import preact, { FunctionalComponent, h, JSX } from "preact";
import {useState, useEffect, useReducer} from "preact/hooks";
import style from "./style.module.css";

type State = {
    firstName: string;
    lastName: string;
    email: string;
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

function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

const SignUp: FunctionalComponent = () => {
    const [passwordEquality, setPasswordEquality] = useState<boolean>(false);
    const [formData, setFormData] = useReducer(formReducer, {firstName:"", lastName:"", email:"",password:"", passwordConfirmation:""});
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
        const passwordMatch = formData.password == formData.passwordConfirmation;
        const passwordhasLength = formData.password.length >= 8
        const emailIsValid = isValidEmail(formData.email)
        const namesAreValid = (formData.firstName.length > 0 && formData.lastName.length> 0)

        if (passwordMatch && passwordhasLength && emailIsValid && namesAreValid) {
            console.log("hallo")
            setSubmitting(true);
            //setPasswordEquality(match);
        } else {
            //setPasswordEquality(match);
        }
        console.log(formData)
        console.log(submitting);
        setTimeout(() => {
          setSubmitting(false);
        }, 3000)
    }

    useEffect(() => {
        console.log("<SIGNUP>");
        console.log(formData)
        // handle session
    }, []);

    return (
        <div className={`container `}>
            <div className="columns">
                <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.signup}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className={`form-label ${style.label}`}>
                                First Name
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="firstName" type="text" placeholder="first name" onChange={handleChange} />
                            </label>
                            <label className={`form-label ${style.label}`}>
                                Last Name
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="lastName" type="text" placeholder="last name" onChange={handleChange} />
                            </label>
                                {
                                    !(formData.firstName.length > 0 && formData.lastName.length> 0) ? <p class="form-input-hint"> Please enter a first and last name! </p> : null
                                }
                            <label className={`form-label ${style.label}`}>
                                Email
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="email" type="text" placeholder="email" onChange={handleChange} />
                            </label>
                                {
                                    (!isValidEmail(formData.email)) ? <p class="form-input-hint"> Please enter a valid email! </p> : null
                                }
                            <label className={`form-label ${style.label}`}>
                                Password
                            </label>
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="password" type="password" placeholder="password" onChange={handleChange} />
                            <label className="form-label"> 
                                <input className="form-input lakelandcup-input-form" name="passwordConfirmation" type="password" placeholder="confirm password" onChange={handleChange} />
                                {
                                    (!(formData.password == formData.passwordConfirmation) || formData.password.length < 8) ? <p class="form-input-hint"> Password does not match or is less than 8 characters! </p> : null
                                }
                            </label>
                            </label>
                            <label className="form-label"> 
                                <button className="btn">
                                    Sign Up
                                </button>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default SignUp;