import { FunctionalComponent, h } from "preact";
import {useState, useEffect} from "preact/hooks";
import style from "./style.module.css";

interface Props {
    authHandler?: string;
}

const Login: FunctionalComponent<Props> = (props: Props) => {
    const [user, setTUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        console.log("<LOGIN>");
        // handle session
    }, []);
    return (
        <div className={`container `}>
            <div className="columns">
                <div className={`column col-3 col-mx-auto col-xs-12 col-lg-6 ${style.login}`}>
                    <div className="form-group">
                        <label className="form-label"> 
                            <input className="form-input lakelandcup-input-form" type="text" placeholder="username" onChange={()=>{}} />
                        </label>
                        <label className="form-label"> 
                            <input className="form-input lakelandcup-input-form" type="password" placeholder="password" onChange={()=>{}} />
                        </label>
                        <label className="form-label"> 
                            <button className="btn" onClick={()=>{}} >
                                Login
                            </button>
                        </label>
                        <div>
                            <b> Don't have an account yet? </b>
                        </div>
                        <div>
                            <b> Please register <a href="/signup">here</a>.</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;

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