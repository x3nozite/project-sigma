import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";



function SignIn() {
    const navigate = useNavigate();
    return (
        <div>
            signin
            <SecondButton title="Back" onClick={() => navigate("/")}/>
        </div>
    )
}

export default SignIn;  