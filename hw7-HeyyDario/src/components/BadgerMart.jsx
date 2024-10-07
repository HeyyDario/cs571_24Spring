import { Text, View, Button, Alert } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";
import React, { useState, useEffect} from "react";

import CS571 from '@cs571/mobile-client'

export default function BadgerMart(props) {

    // variable to manage items
    const [item, setItem] = useState([]);
    // variable to trace current page
    const [currentPage, setCurrentPage] = useState(0);
    // variable to trace number of ordered items
    const [numOrdered, setNumOrdered] = useState({});

    // chunk to trace total variables for "Place Order"
    let totalCost = 0;
    let totalItems = 0;
    item.forEach(i => {
        if (numOrdered[i.name] > 0) {
        totalCost += i.price * numOrdered[i.name];
        totalItems += numOrdered[i.name];
        }
    });

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw7/items', {
            headers:{
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setItem(data);
            setNumOrdered(data.reduce((arr, item) => {
                arr[item.name] = 0;
                return arr;
            }, {}))
        })
    }, [])

    const handlePressPrev = () => {
        currentPage === 0 ? setCurrentPage(0) : setCurrentPage(currentPage - 1)
    }

    const handlePressNext = () => {
        setCurrentPage(currentPage => Math.min(currentPage + 1, Math.ceil(item.length) - 1))
    }

    const handleRemove = (itemName) => {
        setNumOrdered(prev => ({
            ...prev, 
            [itemName]: Math.max(0, prev[itemName] - 1)
        }))
    }

    const handleAdd = (itemName) => {
        setNumOrdered((prev) => ({
            ...prev, 
            [itemName]: Math.min(item.find(i => i.name === itemName).upperLimit, prev[itemName] + 1)
        }))
    }

    const handlePlaceOrder = () => {
        // alert
        Alert.alert("Order Confirmed!",
                    `Your order contains ${totalItems} items and costs $${totalCost.toFixed(2)}!`);

        // reset
        setNumOrdered(Object.keys(numOrdered).reduce((arr, itemName) => {
            arr[itemName] = 0;
            return arr;
        }, {}));
        setCurrentPage(0);
    }

    // variable to manage the item on each separate page
    const pageItem = item.slice(currentPage * 1, (currentPage + 1) * 1);

    return <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 28}}>Welcome to Badger Mart!</Text>
        
        <View style={{flexDirection: 'row'}}>
            <Button 
                title="Previous"
                disabled={currentPage === 0}
                onPress={handlePressPrev}>
            </Button>
            <Button 
                title="Next"
                disabled={currentPage === Math.ceil(item.length) - 1}
                onPress={handlePressNext}>
            </Button>
        </View>

        {
            pageItem.map(i => (
                <BadgerSaleItem 
                    key={i.name} 
                    item={i}
                    numOrdered={numOrdered[i.name]}
                    handleAdd={() => handleAdd(i.name)}
                    handleRemove={() => handleRemove(i.name)}
                    totalCost={totalCost}
                    totalItems={totalItems}
                    handlePlaceOrder={handlePlaceOrder}/>
            ))
        }
    </View>
}