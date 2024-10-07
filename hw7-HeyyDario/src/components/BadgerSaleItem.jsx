import { Text, View, Image, Button } from "react-native";

export default function BadgerSaleItem(props) {

    //console.log(props)
    //console.log(props.item)
    //how to align Button '-', '+' and the Text between them in BadgerSaleItem in react native?
    //-> ref: https://stackoverflow.com/questions/54967940/aligning-button-in-react-native

    return <View style={{alignItems: 'center'}}>
        <Image source={{uri: props.item.imgSrc}} style={{width: 300, height: 300, justifyContent: 'center'}} />
        <Text style={{fontSize: 38, alignItems: 'center'}}>{props.item.name}</Text>
        <Text>${props.item.price.toFixed(2)} each</Text>
        <Text>You can order up to {props.item.upperLimit} units!</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
            <Button title="-" onPress={props.handleRemove} disabled={props.numOrdered === 0} />
            <Text style={{marginHorizontal: 10}}>{props.numOrdered}</Text>
            <Button title="+" onPress={props.handleAdd} disabled={props.numOrdered >= props.item.upperLimit} />
        </View>
        <View style={{alignItems: 'center'}}>
            <Text>You have {props.totalItems} item(s) costing ${props.totalCost} in your cart!</Text>
            <Button 
                title="PLACE ORDER"
                disabled={props.totalItems === 0}
                onPress={props.handlePlaceOrder}></Button>
        </View>
    </View>
}
