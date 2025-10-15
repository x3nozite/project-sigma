import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";

function CreateAccount() {
    const navigate = useNavigate();
    return (
        <div>
            createacc
            <SecondButton title="Back" onClick={() => navigate("/")}/>
        </div>
    )
}

export default CreateAccount;