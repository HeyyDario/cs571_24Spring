import createChatDelegator from "./ChatDelegator";
import { isLoggedIn, ofRandom, getLoggedInUsername } from "./Util"

// FIXME LINE139, messages.map is not a function, why? FIXED
const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "WAMCFP7LC3FGSN2K74DSGPFC7AMBPUJK"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        // console.log(prompt);
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleTranscription = async (rawSound, contentType) => {
        const resp = await fetch(`https://api.wit.ai/dictation`, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            },
            body: rawSound
        })
        const data = await resp.text();
        const transcription = data
            .split(/\r?\n{/g)
            .map((t, i) => i === 0 ? t : `{${t}`)  // Turn the response text into nice JS objects
            .map(s => JSON.parse(s))
            .filter(chunk => chunk.is_final)       // Only keep the final transcriptions
            .map(chunk => chunk.text)
            .join(" ");                            // And conjoin them!
        return transcription;
    }

    const handleSynthesis = async (txt) => {
        if (txt.length > 280) {
            return undefined;
        } else {
            const resp = await fetch(`https://api.wit.ai/synthesize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "audio/wav",
                    "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    q: txt,
                    voice: "Rebecca",
                    style: "soft"
                })
            })
            const audioBlob = await resp.blob()
            return URL.createObjectURL(audioBlob);
        }
    }

    const handleGetHelp = async () => {
        return ofRandom([
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "Try asking 'how to sign up', or ask for more help!",
            "Try asking 'show me a list of chatrooms', or ask for more help!"
        ]);
    }

    const handleGetChatrooms = async () => {
        console.log(chatrooms);
        console.log(chatrooms.length);
        if (chatrooms) { // if it is not empty
            let toReturn = `Of course, there are ${chatrooms.length} chatrooms: `
            chatrooms.forEach(item => {
                toReturn += `${item}, `
            })
            // remove ", "
            toReturn = toReturn.slice(0, toReturn.length - 2);
            toReturn += "."
            return toReturn;
        } else {
            return "No chatroom available."
        }
        // SHOULD NEVER REACH HERE
        return "I should respond with a list of chatrooms..."
    }

    const handleGetMessages = async (data) => {
        //console.log(data);
        //If the number is omitted, you may assume that it is 1. 
        //assume a user will always either 
        //(a) not type a number at all or 
        //(b) type in a number between 1 and 10.
        let quantity = data.entities["wit$number:number"] ? Math.floor(data.entities["wit$number:number"][0].value) : 1;
        //console.log(quantity)

        //If the chatroom is omitted, you may assume that it is the latest overall posts across all chatrooms.
        let room = data.entities["chatrooms:chatrooms"] ? data.entities["chatrooms:chatrooms"][0].value : ''; //FIXME CHANGE THE DEFAULT CHATROOM HERE
        //console.log(room);

        //TODO FETCH MESSAGES (200, 400, 404)
        if (room) { // if chatroom is specified
            const res = await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${room}&num=${quantity}`, {
                method: 'GET',
                // credentials: 'include',
                headers: {
                    'X-CS571-ID': CS571.getBadgerId(),
                    'Content-Type': 'application/json'
                }
            })
            if (res.status === 200) {
                //OK
                const messages = await res.json();
                console.log(messages);
                return messages.messages.map(message => `In ${message.chatroom}, 
                                        ${message.poster} created a post titled ${message.title}, 
                                        saying that ${message.content}.`);
            } else if (res.status === 400) {
                // BAD REQUEST
                return "Try using other Commands like 'get 3 posts from Grainger Hall Gatherings!'"
            } else if (res.status === 404) {
                // NO SUCH THING
                return "Sorry, no latest post was created here."
            }
        } else { // if chatroom isn't specified
            const res = await fetch(`https://cs571.org/api/s24/hw11/messages?num=${quantity}`, {
                method: 'GET',
                // credentials: 'include',
                headers: {
                    'X-CS571-ID': CS571.getBadgerId(),
                    'Content-Type': 'application/json'
                }
            })
            if (res.status === 200) {
                //OK
                const messages = await res.json();
                //console.log(messages);
                return messages.messages.map(message => `In ${message.chatroom}, 
                                        ${message.poster} created a post titled ${message.title}, 
                                        saying that ${message.content}.`);
            } else if (res.status === 400) {
                // BAD REQUEST
                return "Try using other Commands like 'get 3 posts from Grainger Hall Gatherings!'"
            } else if (res.status === 404) {
                // NO SUCH THING
                return "Sorry, no latest post was created here."
            }
        }
        return "Some unexpected error kills the fetch."
    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE", data);
    }

    const handleLogout = async () => {
        if (await isLoggedIn()) {
            const res = await fetch("https://cs571.org/api/s24/hw11/logout", { // 200
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
            })
            if (res.status === 200) {
                return "You have been successfully logged out."
            } else {
                return "Cannot log out."
            }
        } else {
            return "You need to be logged in before logging out.";
        }
        return "I should try to log out..."
    }

    const handleWhoAmI = async () => {
        //console.log(await isLoggedIn());
        if (await isLoggedIn()) {
            return `You are currently logged in as ${await getLoggedInUsername()}.`
        } else {
            return `You are not logged in.`
        }
        return "I should see who I am..."
    }

    return {
        handleInitialize,
        handleReceive,
        handleTranscription,
        handleSynthesis
    }
}

export default createChatAgent;