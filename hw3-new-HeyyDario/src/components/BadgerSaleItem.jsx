import { useState } from "react";

// Got the idea on how to disable a button on: https://upmostly.com/tutorials/the-disabled-attribute-in-react-buttons 
export default function BadgerSaleItem(props) {
    const [isClicked, setIsClicked] = useState(0);
    
    /**
     * This function is used to increase by 1.
     */
    function increase(){
        setIsClicked(isClicked + 1);
    }
    
    /**
     * This function is used to decrease by 1.
     */
    function decrease(){
        setIsClicked(isClicked > 0 ? isClicked - 1 : 0);
    }
    

    const feature = { // task 4: hightlight featured item
        backgroundColor: props.featured ? 'red' : 'white',
        font : props.featured ? 'cursive' : 'normal',
        fontWeight: props.featured ? 'bold' : 'normal'
    };

    // Got the usage of disabled from https://stackoverflow.com/questions/23701560/dom-disabled-property-in-javascript
    return <div style={feature}>
        <h2>{props.name}</h2>
        <p>{props.description}</p>
        <p>${props.price}</p>
        <div>
            <button className="inline" onClick={decrease} disabled={isClicked <= 0}>-</button> 
            <p className="inline">{isClicked}</p>
            <button className="inline" onClick={increase}>+</button>
        </div>
    </div>
}