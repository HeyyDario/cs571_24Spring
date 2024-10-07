import { useState } from "react";
import {Button, Card, Carousel} from "react-bootstrap";
function BadgerBudSummary(props){
    //console.log(props);
    const [details, setDetails] = useState(false);
    
    //props.imgIds.map(imgID => `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/imgID`);
    const [index, setIndex] = useState(0); //carousel index

    const showClick = () => setDetails(!details);
    const saveCats = () => {
        // Get the array of adopted cat IDs from sessionStorage or initialize a new array if it doesn't exist
        let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        if (!Array.isArray(savedCatIds)) {
            savedCatIds = [];
        }
         // Add the current cat's ID to the array and save it back to sessionStorage
        savedCatIds.push(props.id);
        sessionStorage.setItem('savedCatIds',JSON.stringify(savedCatIds))
        props.removeCat(props.id);
        alert(`${props.name} has been added to your basket!`)
    }

    const images = props.imgIds.map(imgId => 
        `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${imgId}`
    );

    const Emoji = props => (
        <span
            className="emoji"
            role="img"
            aria-label={props.label ? props.label : ""}
            aria-hidden={props.label ? "false" : "true"}
        >
            {props.symbol}
        </span>
    ); //learned how to create emoji from https://medium.com/@seanmcp/%EF%B8%8F-how-to-use-emojis-in-react-d23bbf608bf7


    return <Card>
        {details ? (
                <Carousel>
                    {images.map((src, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={src}
                                alt={`pic ${index + 1}`}
                                style={{width: "100%", height: "auto", aspectRatio: "1 / 1"}} //https://www.w3schools.com/react/react_css.asp
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <Card.Img variant="top" src={images[0]} alt={`A picture of ${props.name}`} style={{width: "100%", height: "auto", aspectRatio: "1 / 1"}}/>
            )}

        <h2>{props.name}<Emoji symbol="😺" label="grinning cat"/></h2>
        {
            props.isBasket ? (
                <div>
                <Button onClick={() => props.unselectBuddy(props.id)}>Unselect</Button>
                <Button onClick={() => props.handleAdopt(props.name, props.id)}>Adopt</Button>
                </div>
            ) : (
                <>
                    {details && (
                        <div>
                            <p><strong>Gender:</strong> {props.gender}</p>
                            <p><strong>Age:</strong> {props.age}</p>
                            <p><strong>Breed:</strong> {props.breed}</p>
                            {
                                props.description && (<p>Description: {props.description}</p>) 
                                // if (props.description) {
                                //     <p>Description: {props.description}</p>
                                // } https://stackoverflow.com/questions/40477245/is-it-possible-to-use-if-else-statement-in-react-render-function
                                
                            }
                        </div>
                    )}
                <Button onClick={showClick}>{details ? 'show less' : 'show more'}</Button>
                <Button onClick={saveCats}>save</Button>
                </>
            )
        }
    </Card>
}

export default BadgerBudSummary;