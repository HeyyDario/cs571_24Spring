import { isLoggedIn, ofRandom } from "../Util"
import AIEmoteType from '../../components/chat/messages/AIEmoteType';

const createRegisterSubAgent = (end) => {

    let stage;
    let username, password, confirmation;

    const handleInitialize = async (promptData) => {
        // the agent should inform them that need to be logged out before registering
        if(await isLoggedIn()){
            //end();
            return "You need to first log out before registering.";
        } else {
            stage = "FOLLOWUP_USERNAME";
            return "Great! What username would you like to use?"
        }

        //SHOULD NEVER REACH HERE
        return end("I should try to register...")
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
            case "FOLLOWUP_CONFIRMATION": return await handleFollowupConfirmation(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt
        stage = "FOLLOWUP_PASSWORD"
        return ofRandom([
            {
                msg: "Thanks, what password would you like to use?",
                nextIsSensitive: true,
            },
            {
                msg:"Alright, what password do you want to use?",
                nextIsSensitive: true,
            },
        ])
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        stage = "FOLLOWUP_CONFIRMATION";
        return ofRandom([
            {
                msg: "Lastly, please confirm your password!",
                nextIsSensitive: true,
            },
            {
                msg: "Finally, please confirm your password!",
                nextIsSensitive: true,
            }
        ])
    }

    const handleFollowupConfirmation = async(prompt) => {
        confirmation = prompt;
        stage = undefined;
        const res = await fetch("https://cs571.org/api/s24/hw11/register", { // 200, 400, 409, 413
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                confirmation: confirmation,
            })
        })
        end(); //FIXME HERE
        if(res.status === 200){
            return ofRandom([
                {
                    msg: `Success! You account has been registered. Welcome ${username}!`,
                    emote: AIEmoteType.SUCCESS
                },
                {
                    msg: `You account has been registered successfully. Welcome ${username}!`,
                    emote: AIEmoteType.SUCCESS
                }
            ])
        } else if (res.status === 409) {
            return ofRandom([
                {
                    msg: "The username is already taken! Try another one.",
                    emote: AIEmoteType.ERROR,
                },
                {
                    msg: "Sorry, that username already exists. Please try registering again!",
                    emote: AIEmoteType.ERROR,
                },
            ])
        } else {
            return ofRandom([
                {
                    msg: "Sorry, your confirmation does not match your original password. Please try to register again.",
                    emote: AIEmoteType.ERROR,
                }
            ])
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;