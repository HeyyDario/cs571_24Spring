import {useContext, useEffect, useState} from "react"
import BadgerBudSummary from "../BadgerBudSummary"
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import {Container, Row, Col} from "react-bootstrap"

export default function BadgerBudsAdoptable(props) {
    const buddies = useContext(BadgerBudsDataContext);
    const [availBuddies, setAvailBuddies] = useState([]);

    useEffect(() => {
        let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        if (!Array.isArray(savedCatIds)) {
            savedCatIds = [];
        }

        let adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));
        if (!Array.isArray(adoptedCatIds)) {
            adoptedCatIds = [];
        }

        setAvailBuddies(buddies.filter(buddy => !savedCatIds.includes(buddy.id)));
      }, [buddies]);
    
    const removeCat = (id) => {
        setAvailBuddies(availBuddies.filter(buddy => buddy.id !== id));
    };

    const containerStyle = {
        width: "100%"
    }

    return <div>
        <h1>Available Badger Buds</h1>
        {availBuddies.length > 0 ? ( //https://kinsta.com/knowledgebase/jsx-expressions-must-have-one-parent-element/
            <>
            <p>The following cats are looking for a loving home! Could you help?</p>
            <Container style={containerStyle}>
                <Row>
                    {availBuddies.map((buddy) => (
                        <Col xs={12} sm={12} md={6} lg={4} xl={3} key={buddy.id}>
                            <BadgerBudSummary {...buddy} removeCat={removeCat}/>
                        </Col>
                    ))
                    }
                </Row>
            </Container>
            </>
        ) : (
            <p>No buds are available for adoption!</p>
        )}
    </div>
}