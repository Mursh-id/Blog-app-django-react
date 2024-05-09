import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { toast } from "sonner";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === "register" && password !== passwordConfirm) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const formData = {
                username,
                password,
            };

            if (method === "register") {
                formData.password_confirm = passwordConfirm; // Include password confirmation for registration
            }

            const res = await api.post(route, formData);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                toast.success("You are successfully registered");
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // If error response exists and contains data
                const errorMessage = Object.values(error.response.data).join(", ");
                toast.error(errorMessage); // Display the error message to the user
            } else {
                console.error(error);
                toast.error("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {method === "register" && (
                <input
                    className="form-input"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm Password"
                />
            )}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
            {method === "register" ? (
                <p>Already have an Account ? <Link to='/login'>go to login</Link></p>
            ) : (
                <p>Dont have an account ? <Link to='/register' >Register here</Link></p>
            )}

        </form>
    );
}

export default Form;
