import { isLoggedIn, ofRandom } from "../Util"
import AIEmoteType from '../../components/chat/messages/AIEmoteType';

// Basically implemented all tasks, however, encounter question when "create a post", then "create a post in CHATROOM"
const createPostSubAgent = (end) => {

    const CS571_WITAI_ACCESS_TOKEN = "WAMCFP7LC3FGSN2K74DSGPFC7AMBPUJK"; // Put your CLIENT access token here.
    let stage;
    let title, content, confirmation;
    let chatroom; // the chatroom the user is gonna post in

    const handleInitialize = async (promptData) => {

        if (await isLoggedIn()) {
            console.log(promptData);
            // get the name of a specific chatroom
            if (promptData.entities["chatrooms:chatrooms"]) { // if a chatroom is specified
                chatroom = promptData.entities["chatrooms:chatrooms"][0].value;
            } else {
                end();
                return "You must specify a chatroom to post in.";
            }
            stage = "FOLLOWUP_TITLE";
            return ofRandom([
                "Sounds good, what would you like your title to be?",
                "Great, what would your title be like?"
            ])
        } else {
            return "You need to be logged in before creating a post.";
        }
        return end("I should try to create a post...")
    }

    const handleReceive = async (prompt) => {
        switch (stage) {
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONTENT": return await handleFollowupContent(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    }

    const handleFollowupTitle = async (prompt) => {
        title = prompt;
        stage = 'FOLLOWUP_CONTENT';
        return ofRandom([
            "Alright, and what should be the content of your post?",
            "Great, type in something as the content of your post!"
        ]);
    }

    const handleFollowupContent = async (prompt) => {
        content = prompt;
        //console.log(prompt);
        stage = 'FOLLOWUP_CONFIRM';
        return ofRandom([
            "Sounds good, are you ready to post this comment?",
            "Great, are you ready to post this comment?"
        ])
    }

    const handleFollowupConfirm = async (prompt) => {
        confirmation = prompt;
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0 && data.intents[0].name === 'wit$confirmation') {
            const res = await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${chatroom}`, {
                method: 'POST',
                headers: {
                    //"Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
                    "Content-Type": 'application/json',
                    "X-CS571-ID": CS571.getBadgerId(),
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                }),
                credentials: 'include',
            })
            end();
            if (res.status === 200) {
                //success
                return ofRandom([
                    {
                        msg: "Your message has been successfully posted!",
                        emote: AIEmoteType.SUCCESS,
                    },
                    {
                        msg: "Congrats, your message has been successfully posted!",
                        emote: AIEmoteType.SUCCESS,
                    }
                ]);
            } else if (res.status === 400) {
                //miss title or content
                return "You need to have both title and content filled so that your message can be posted."
            } else if (res.status === 401) { // 404, 413?
                //authentication failed 
                return "Authentication failed."
            }
        } else {
            return end(ofRandom([
                "No worries, if you want to create a post in the future, just ask!",
                "That's alright, if you want to create a post in the future, just ask!"
            ]))
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;