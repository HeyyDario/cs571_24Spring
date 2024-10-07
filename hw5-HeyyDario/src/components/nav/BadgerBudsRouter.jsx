import { BrowserRouter, Route, Routes } from "react-router-dom";

import BadgerBuds from "../BadgerBuds";
import BadgerBudsLanding from "./pages/BadgerBudsLanding"
import BadgerBudsAdoptable from "./pages/BadgerBudsAdoptable";
import BadgerBudsBasket from "./pages/BadgerBudsBasket";
import BadgerBudsNoMatch from "./pages/BadgerBudsNoMatch";


export default function BadgerBudsRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<BadgerBuds />}>
                <Route index element={<BadgerBudsLanding />} />
                {/* TODO: Add your routes here! */}
                <Route path="/available-cats" element={<BadgerBudsAdoptable />}></Route>
                <Route path="/basket" element={<BadgerBudsBasket />}></Route>
                <Route path="*" element={<BadgerBudsNoMatch />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
}