//import CS571 from '@cs571/mobile-client'


const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "IQLVJCQJJ26MEMZMFEYSVZOUUKY5HPKX"; // Put your CLIENT access token here.

    let availableItems = [];
    let cart = [];

    const handleInitialize = async () => {
        const res = await fetch('https://cs571.org/api/s24/hw10/items', {
            headers: {
                'X-CS571-ID': 'bid_1d063ccf6b89665aacf1c67b3c0e21c34620e5da7b20995dbc0042f3b2c2cecb', // bid_1d063ccf6b89665aacf1c67b3c0e21c34620e5da7b20995dbc0042f3b2c2cecb //CS571.getBadgerId()
            }
        });
        // const data = await res.json();
        // console.log(data);
        
        availableItems = [];
        cart = [];
        if(res.status === 200){
            const data = await res.json();
            availableItems = data;
        } else {
            console.log('Cannot fetch items.');
        }
        return "Welcome to BadgerMart Voice! :) Type your question, or ask for help if you're lost!"
    }

    const handleReceive = async (prompt) => {
        // TODO: Replace this with your code to handle a user's message!
        const res = await fetch('https://api.wit.ai/message?q=' + encodeURIComponent(prompt), {
            headers:{
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        })
        const data = await res.json();
        //console.log(data);
        if(data.intents.length > 0){
            switch(data.intents[0].name) { // this represents best match
                case 'get_help': return getHelp();
                case 'get_items': return getItems();
                case 'get_price': return getPrice(data);
                case 'add_item': return addItem(data);
                case 'remove_item': return removeItem(data);
                case 'view_cart': return viewCart(data);
                case 'checkout': return checkOut(data);
                // default
            }
        } 
        // if the given prompt cannot be understood by your Wit.AI agent simply tells the user to ask for help.
        return "Sorry, I didn't get that. Type 'help' to see what you can do!"
    }

    const getHelp = async () => {
        return "In BadgerMart Voice, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!"
    }

    const getItems = async () => {
        // what if no available items?
        if(!availableItems){
            return 'We don\'t have any item today! We apologize for any inconvenience this might cause to you!';
        }
        let toReturn = 'We have ';

        if(availableItems.length === 1){
            toReturn += `${availableItems[0].name} for sale!`
        }

        availableItems.forEach(item => {
            toReturn += `${item.name.toLowerCase()}, `
            
            if(availableItems[availableItems.length - 1].name.toLowerCase() === item.name.toLowerCase()){// this is the last one
                toReturn = toReturn.replace(`${item.name.toLowerCase()}, `, `${item.name.toLowerCase()} `);
            }
            // make sure that availableItems.length >= 2
            if(availableItems[availableItems.length - 2].name.toLowerCase() === item.name.toLowerCase()){// this is last - 1,
                toReturn = toReturn.replace(`${item.name.toLowerCase()}, `, `${item.name.toLowerCase()} and `);
                //console.log(toReturn);
            }
        })

        toReturn += 'for sale!'
        return toReturn; 
    }

    const getPrice = async (promptData) => {
        // item mentioned in the prompt
        // console.log(promptData.entities === false);
        // console.log(promptData.entities["available_items:available_items"]);
        
        const inputItem = promptData.entities["available_items:available_items"] ? promptData.entities["available_items:available_items"][0].body.toLowerCase() : '';

        // check if the item is in availableItems
        const availableItem = availableItems.find(i => i.name.toLowerCase() === inputItem);

        // if exist, then print price, else is not in stock
        if(availableItem){
            return "The price of " + availableItem.name.toLowerCase() + "s is $" + availableItem.price + " each."
        } else {
            return "This item is not in stock. Try another one."
        }
        // should never use this
        return "Sorry, I didn't get that. Type 'help' to see what you can do!"
    }

    const addItem = async (promptData) => {
        //If the user fails to mention a particular item, or asks for an item that is not for sale
        //(e.g. "add a banana to my basket"), your agent should respond with the item is not in stock.
        const inputItem = promptData.entities["available_items:available_items"] ? promptData.entities["available_items:available_items"][0].body.toLowerCase() : '';
        // check if the item is in availableItems
        const availableItem = availableItems.find(i => i.name.toLowerCase() === inputItem);
        if(!availableItem){return "This item is not in stock. Try another one."}
        //console.log(availableItem);
        // after this, availableItem should have something in it.

        // If the user fails to mention a quantity, you may assume that the quantity is 1.

        // If the user requests 0 or less of an item, your agent should inform the user that the quantity is invalid.

        // If the user provides a non-integer, you may use Math.floor to round to an integer.
        const quantity = promptData.entities["wit$number:number"] ? Math.floor(promptData.entities["wit$number:number"][0].value) : 1;
        if(quantity <= 0){return "This quantity is invalid. We cannot add " + quantity + availableItem.name.toLowerCase() + "."}
        //console.log(quantity)

        // add availableItem to cart
        // traverse to see if item is in the cart, if is, add quantity
        const cartItem = cart.find(i => i.name === availableItem.name.toLowerCase());
        // if not push item to cart
        //console.log(!cartItem)
        if(!cartItem){
            cart.push({name: availableItem.name.toLowerCase(), quantity: quantity});
            //console.log(cart);
        } else {
            cartItem.quantity += quantity;
        }

        //console.log(cartItem)
        //console.log(cartItem.name)
        let dup = (quantity === 1) ? quantity + " " + availableItem.name.toLowerCase() : quantity + " " + availableItem.name.toLowerCase() + "s"
        return "Sure! We've added " + dup + " to your cart."
    }

    const removeItem = async (promptData) =>{
        //If the user fails to mention a particular item, or asks for an item that is not for sale
        //(e.g. "add a banana to my basket"), your agent should respond with the item is not in stock.
        const inputItem = promptData.entities["available_items:available_items"] ? promptData.entities["available_items:available_items"][0].body.toLowerCase() : '';
        // check if the item is in availableItems
        const availableItem = availableItems.find(i => i.name.toLowerCase() === inputItem);
        if(!availableItem){return "This item is even not in stock, so it is currently not in your cart."}
        // console.log(availableItem);
        // AFTER THIS, AVAILABLEITEM SHOULD HAVE SOMETHING IN IT.

        // If the user fails to mention a quantity, you may assume that the quantity is 1.

        // If the user requests 0 or less of an item, your agent should inform the user that the quantity is invalid.

        // If the user provides a non-integer, you may use Math.floor to round to an integer.
        const quantity = promptData.entities["wit$number:number"] ? Math.floor(promptData.entities["wit$number:number"][0].value) : 1;
        if(quantity <= 0){return "This quantity is invalid. We cannot remove " + quantity + " " + availableItem.name.toLowerCase() + "."}
        //console.log(quantity)

        // add availableItem to cart
        // traverse to see if item is in the cart, if is, add quantity
        const cartItem = cart.find(i => i.name === availableItem.name.toLowerCase());
        // if not push item to cart
        //console.log(!cartItem)
        if(!cartItem){
            return `${availableItem.name.toLowerCase()} is originally not in your cart. You don't have any ${availableItem.name.toLowerCase()} in your cart.`;
            //console.log(cart);
        } else {
            if(cartItem.quantity > quantity){ //remove some
                cartItem.quantity -= quantity;
                return `${quantity} ${cartItem.name}(s) have been removed from your cart.`;
            } else { // remove all, then remove the item from the cart
                let temp = cartItem.quantity;
                cartItem.quantity -= quantity;
                cart = cart.filter(i => i.quantity > 0); // any item whose quantity is <= 0 should be removed
                return `The remaining ${temp} ${cartItem.name.toLowerCase()}(s) that you ordered have all been removed from your cart.`
            }
        }

        // SHOULD NOT REACH HERE
        //console.log(cartItem)
        //console.log(cartItem.name)
        let dup = (quantity === 1) ? quantity + " " + availableItem.name.toLowerCase() : quantity + " " + availableItem.name.toLowerCase() + "s"
        return "Sure! We've added " + dup + " to your cart."
    }

    const viewCart = async (promptData) => {
        //console.log(cart === false);
        let totalPrice = 0;
        let toReturn = 'You have ';
        if(cart.length <= 0){
            return "Your cart is empty! Buy something to make your day!"
        } else {
            switch(cart.length){
                case 1: {
                    // extract price based on name
                    let temp = cart[0].name;
                    toReturn += `${cart[0].quantity} ${temp}(s) in your cart, totaling $`;
                    for(let i = 0; i < availableItems.length; i++){
                        if(temp.toLowerCase() === availableItems[i].name.toLowerCase()){
                            let price_per_item = availableItems[i].price;
                            totalPrice = cart[0].quantity * price_per_item;
                        }
                    }
                    toReturn += `${totalPrice}.`
                }
            }

            if(cart.length >= 2){
                cart.forEach(item => {
                    const temp = availableItems.find(i => i.name.toLowerCase() === item.name.toLowerCase()); // temp variable to hold item with the same name
                    //console.log(temp);
                    if (temp){
                        totalPrice += item.quantity * temp.price;
                        toReturn += `${item.quantity} ${item.name}(s), `
                    }
                    //replace the last - 1 "," with "and"
                    //apple, egg, 
                    //replace the last "," with ''
                    // console.log(cart[cart.length - 2].name)
                    // console.log(item.name)
                    if(cart[cart.length - 2].name === item.name){// this is last - 1,
                        toReturn = toReturn.replace(`${item.name}(s), `, `${item.name}(s) and `)
                        //console.log(toReturn);
                    }
                    if(cart[cart.length - 1].name === item.name){// this is the last one
                        toReturn = toReturn.replace(`${item.name}(s), `, `${item.name}(s) `)
                    }
                })
                toReturn += `in your cart, totaling $${totalPrice}.`
            }
            return toReturn;
        }
    }

    const checkOut = async (promptData) => {
        if(cart.length > 0){
            // prepare checkout items in a json form
            const checkOutItems = {};
            // Item names are case-sensitive and must be included even if the quantity is 0.
            // initialization
            availableItems.forEach(item => {
                checkOutItems[item.name] = 0;
            });
            // give specific quantity
            // from https://sentry.io/answers/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript/
            cart.forEach(item =>{
                const modItemName = item.name[0].toUpperCase() + item.name.slice(1);
                checkOutItems[modItemName] = item.quantity;
            })
            console.log(checkOutItems);

            // checkout as desisred
            const res = await fetch('https://cs571.org/api/s24/hw10/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CS571-ID': 'bid_1d063ccf6b89665aacf1c67b3c0e21c34620e5da7b20995dbc0042f3b2c2cecb'
                },
                body: JSON.stringify(checkOutItems)
            })
            const data = await res.json(); //confirmation ID

            console.log(data);
            if(res.status === 200){
                cart = []; //clear the cart
                return `${data.msg} Your confirmation ID is ${data.confirmationId}.`
            } else if (res.status === 400){
                return "Cannot checkout."
            }
        } else {
            return "You cart is empty. Try to buy something before you checkout~"
        }
        // SHOULD NEVER REACH HERE
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;