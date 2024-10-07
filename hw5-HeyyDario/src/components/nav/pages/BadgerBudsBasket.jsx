import { useContext, useState, useEffect } from 'react';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import BadgerBudSummary from '../BadgerBudSummary';

export default function BadgerBudsBasket(props) {
    const buddies = useContext(BadgerBudsDataContext);
    const [savedBuddies, setSavedBuddies] = useState([]);

    const handleAdopt = ((name, id) => {
        let adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));
        if (!Array.isArray(adoptedCatIds)) {
            adoptedCatIds = [];
        }

        adoptedCatIds.push(id);
        sessionStorage.setItem('adoptedCatIds', JSON.stringify(adoptedCatIds));

        setSavedBuddies(old => old.filter(buddy => buddy.id !== id));
        //console.log(savedBuddies);
        alert(`${name} has been adopted!🤩😽`);
    });

    useEffect(() => {
        let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        if (!Array.isArray(savedCatIds)) {
            savedCatIds = [];
        }

        // savedCatIds.push(id);
        // sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));

        let adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));
        if (!Array.isArray(adoptedCatIds)) {
            adoptedCatIds = [];
        }
        const savedBuddiesList = buddies.filter(buddy => 
            savedCatIds.includes(buddy.id) && !adoptedCatIds.includes(buddy.id)
        );
        setSavedBuddies(savedBuddiesList);
    }, [buddies]);

    // Function to remove a buddy from the basket
    const unselectBuddy = (id) => {
        // Update sessionStorage
        const updatedSavedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')).filter(catId => catId !== id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedCatIds));
    
        // Update the state to remove the buddy from the basket
        setSavedBuddies(savedBuddies.filter(buddy => buddy.id !== id));
    };

    return <div>
        <h1>Badger Buds Basket</h1>
        {savedBuddies.length > 0 ? (
            <>
            <p>These cute cats could be all yours!</p>
            <Row>
            {savedBuddies.map(buddy => (
              <Col xs={12} sm={12} md={6} lg={4} xl={3} key={buddy.id}>
                <BadgerBudSummary
                  {...buddy}
                  isBasket={true}
                  unselectBuddy={unselectBuddy}
                  handleAdopt={() => handleAdopt(buddy.name, buddy.id)}
                />
              </Col>
              
            ))}
          </Row>
          </>
        ) : (
            <p>You have no buds in your basket!</p>
        )}
    </div>
}