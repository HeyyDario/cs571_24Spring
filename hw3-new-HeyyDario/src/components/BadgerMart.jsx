import { useEffect, useState } from "react"
import BadgerSaleItem from "./BadgerSaleItem";
import { Col, Container, Row } from "react-bootstrap";

export default function BadgerMart(props) {

    const [saleItems, setSaleItems] = useState([]);
    // store featured item
    const [featuredItem, setFeaturedItem] = useState(null);

    // add a search bar
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw3/all-sale-items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setSaleItems(data);

            //const featuredSaleItem = data.find(item => item.featured); // Got the function usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find 
            // Since the find function only "returns the first element in the provided array that satisfies the provided testing function", what if we need to find more items?
            // alternative: use loop -- Got the inspiration from the discussion with PM Catherine Tan.
            let featuredTmp = null;
            for(let i = 0; i < data.length; i++){
                if(data[i].featured){
                    featuredTmp = data[i];
                    break; // Jump out of the loop once we find the first featured item. If there are more featured items, simply store them in an array called featuredTmp.
                }
            }

            setFeaturedItem(featuredTmp);
            //console.log(featuredSaleItem);
            //setFeaturedItem(featuredSaleItem);
        })
    }, [])

    // search functionality
    const searchedItem = saleItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.description.toLowerCase().includes(searchQuery.toLowerCase()));
            
    // use grids effectively
    const gridStyle = {
            border: '0.1px solid #ddd',
            padding: '10px',
            borderRadius: '10px'
    };


    return <div>
        <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  />
        <h1>Badger Mart</h1>
        <p>Welcome to our small-town mini mart located in Madison, WI!</p>
        {
            featuredItem? 
            <div><p>Today's featured item is <strong>{featuredItem.name}</strong> for <strong>${featuredItem.price}</strong>!</p>
            <img src="../_figures/Molasses.jpeg" alt={featuredItem.name} style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px' }} /> 
            </div>
            :
            (<p>Loading...</p>)
        }
        
        <Container>
            <Row>
            {
                saleItems.map(saleItem => {
                    return <Col key={saleItem.name} xs={12} md={6} lg={4} xl={3} style={gridStyle}>
                        <BadgerSaleItem
                            name={saleItem.name}
                            description={saleItem.description}
                            price={saleItem.price}
                            featured={saleItem.featured}
                        />
                    </Col>
                })
            }
            </Row>
        </Container>
    </div>
}