import { isLoggedIn, ofRandom } from "../Util"
import AIEmoteType from '../../components/chat/messages/AIEmoteType';

const createLoginSubAgent = (end) => {

    let stage;
    let username, password;

    const handleInitialize = async (promptData) => {
        //console.log(promptData);
        //console.log(isLoggedIn());
        if(await isLoggedIn()){
            //the agent should inform them that 
            //need to be logged out before logging in
            return end(ofRandom([
                "You are already logged in, you need to log out first.",
                "You are already signed in, you need to sign out first."
            ]))
        } else {
            //follow up to collect the user's username and password
            stage = "FOLLOWUP_USERNAME";
            return "Sure, what is your username?"
        }
        // SHOULD NEVER REACH HERE
        return "I should try to login..."
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt
        stage = "FOLLOWUP_PASSWORD"
        return ofRandom([
            {
                msg: "Sure, what is your password?",
                nextIsSensitive: true,
                //emote: AIEmoteType.SUCCESS
            },
            {
                msg: "Alright, what is your password?",
                nextIsSensitive: true,
                //emote: AIEmoteType.SUCCESS
            }
        ]);
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        stage = undefined;
        const resp = await fetch("https://cs571.org/api/s24/hw11/login", { // 200, 400, 401
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        end();//WHY HERE?
        // SUCCESS, NORMAL, ERROR
        if (resp.status === 200) {
            return ofRandom([ // ofRandom takes an array as an object
                {
                    msg: "You have successfully logged in!",
                    emote: AIEmoteType.SUCCESS 
                },
                {
                    msg: "Success! You are currently logged in!",
                    emote: AIEmoteType.SUCCESS
                }
            ]);
        } else { // 401
            return ofRandom([
                {
                    msg: "Sorry, that username and password is incorrect!",
                    emote: AIEmoteType.ERROR,
                },
                {
                    msg: "Your username and password is incorrect! Try to enter a correct one!",
                    emote: AIEmoteType.ERROR,
                },
            ])
        }
        // TODO TRY TO LOGIN THE USER 
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;