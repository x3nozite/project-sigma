import { useNavigate } from "react-router-dom";
import { SecondButton } from "./ui/buttons";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function CreateAccount() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        try {
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) {
                alert("Error creating account: " + error.message);
            } else {
                alert("Account created successfully, please verify your email");
                navigate("/signin");
            }
        }

        catch (error) {
            alert("Error creating account: " + error);
        }


    }; 
    
    return (
        <div>
            createacc
            <SecondButton title="Back" onClick={() => navigate("/")}/>
        </div>
    )
}

export default CreateAccount;