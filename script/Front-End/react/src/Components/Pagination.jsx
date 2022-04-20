import React, { useState, useRef,useEffect } from 'react';
import {HiArrowNarrowRight} from "react-icons/hi"
// BsArrowLeft
// BsArrowRight
export default function Pagination({data, cureentPage, increase, reduce}) {
    const [numOfItems , setNumOfItems] = useState(5);
    //currentPage*itmes - items to currentPage * items
    return (
        <div>
            <button onClick={()=>{}}><HiArrowNarrowRight /></button>
            <button onClick={()=>{}}>(---</button>
            <div></div>
        </div>
    )
}