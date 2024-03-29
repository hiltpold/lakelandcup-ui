import { FunctionalComponent, h, JSX } from "preact";
import { useState, useEffect, useReducer, useContext } from "preact/hooks";
import style from "./style.module.css";
import { AuthContext } from "../../contexts/auth";
import post, { get } from "../../utils/requests";
import formReducer, { FormEnum, SigninType } from "../../utils/reducers";
import Redirect from "../../components/redirect";

function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
}

const initialSignInState = {
    email: "",
    password: "",
};

const SignIn: FunctionalComponent = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [wrongCredentials, setWrongCredentials] = useState<boolean | undefined>(undefined);
    const [formData, setFormData] = useReducer(formReducer<SigninType>, initialSignInState);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleChange = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setFormData({
            type: FormEnum.Set,
            payload: { name: currentTarget.name, value: currentTarget.value },
        });
    };

    useEffect(() => {
        console.log("<SignIn>");
    }, []);

    const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        const emailIsValid = isValidEmail(formData.email);
        const passwordhasLength = formData.password.length >= 8;

        if (!submitting && passwordhasLength && emailIsValid) {
            setSubmitting(true);
            post(`${process.env.BASE_URL_AUTH_SVC}/signin`, formData).then((data) => {
                if (data.status == 200) {
                    get(`${process.env.BASE_URL_AUTH_SVC}/user/info`)
                        .then((data) => {
                            if (data.status == 401) {
                                // TODO: handle error api response
                                console.log(`API response code ${data.status}`);
                                setAuthenticated({ ID: "", State: false, Role: "" });
                                setWrongCredentials(true);
                            } else {
                                setAuthenticated({ ID: data.userId, State: true, Role: data.role });
                                setWrongCredentials(false);
                            }
                        })
                        .catch((err) => console.log(err));
                    setRedirect(true);
                } else {
                    console.log(`API response code ${data.status}`);
                    // TODO: handle error api response
                    setSubmitting(false);
                    setWrongCredentials(true);
                    setAuthenticated({ ID: "", State: false, Role: "" });
                }
            });
        } else {
            setWrongCredentials(true);
        }
    };
    if (authenticated.State == true && redirect == true) {
        return <Redirect to="/adminboard"></Redirect>;
    } else {
        return (
            <div className={`container `}>
                <div className="columns">
                    <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.signin}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    <input
                                        className="form-input lakelandcup-input-form"
                                        type="text"
                                        name="email"
                                        placeholder="email"
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="form-label">
                                    <input
                                        className="form-input lakelandcup-input-form"
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        onChange={handleChange}
                                    />
                                </label>
                                {wrongCredentials ? (
                                    <div>
                                        <b>
                                            <span class="text-error">
                                                Invalid email or password
                                            </span>
                                        </b>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                <label className="form-label">
                                    <button className="btn" onClick={() => {}}>
                                        Sign In
                                    </button>
                                </label>
                                <div>
                                    <b> Don't have an account yet? </b>
                                </div>
                                <div>
                                    <b>
                                        Please register <a href="/signup">here</a>.
                                    </b>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};
export default SignIn;

/*
import Redirect from './redirect'

const loginSection = {
    "padding": "1rem .5rem",
    "background": "#f7f8f9",
    "text-align":"center" 
}

const symBackend = Symbol("loginBackend");

export interface ILoginProps {
    backend: any;
    authHandler: any;
}

export interface ILoginState {
    username: String,
    password: String,
    isAuthenticated: boolean;
}
export default class Login extends Component<ILoginProps, ILoginState> {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            isAuthenticated: false
        };
    }
    componentDidMount(){
        this[symBackend] = Request.getInstance();
        const token = localStorage.getItem('token');
        this[symBackend].get({url: "http://localhost:8080/lakelandcup/api/login", jwt: token}).then((res) => {
            this.setState({ isAuthenticated: res.auth });
            this.props.authHandler(res.auth);
        }).catch( (error) => {
            this.setState({ isAuthenticated: false });
        });
        
    }

    updateUsername = e => {
        this.setState({ username: e.target.value });
    };

    updatePassword = e => {
        this.setState({ password: e.target.value });
    };

    render() {
        console.log("< RENDERED LOGIN >")
        const loginScreen = h("div",{class:"container", style:loginSection},
            h("div",{class: "columns"},
                h("div",{class: "column column col-3 col-mx-auto col-xs-12 col-lg-6"},
                    h("form-group", {},
                        h("label", {class:"form-label"},
                            h("input",{class:"form-input lakelandcup-input-form",type:"text",placeholder: "username", onChange: this.updateUsername},null)
                        ),
                        h("label", {class:"form-label"},
                            h("input",{class:"form-input lakelandcup-input-form",type:"text",placeholder: "password",  onChange: this.updatePassword},null)
                        ),
                        h("label", {class:"form-label"},
                            h("button",{class: "btn", onClick: async ()=>{
                                try {
                                    const loginResponse = await this[symBackend].post({url: "http://localhost:8080/lakelandcup/api/login", payload: {username: this.state.username, password: this.state.password}});
                                    const token = JSON.parse(loginResponse).token;
                                    const authStatus = JSON.parse(loginResponse).auth
                                    this.setState({ isAuthenticated: authStatus });
                                    this.props.authHandler(authStatus);
                                    localStorage.setItem('token', token);
                                } catch(error){
                                    console.log("< LOGIN FAILED >");
                                    //console.log(error);
                                }
                            }},"submit")
                        )
                    )
                )
            )
        );
        return (
            this.state.isAuthenticated ? h(Redirect ,{to: "/adminpanel"}, null) : loginScreen
            //h(Redirect ,{to: "/adminpanel"}, null) 
        );
	

*/
