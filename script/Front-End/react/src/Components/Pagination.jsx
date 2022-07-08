import React, { useState, useRef,useEffect } from 'react';
// BsArrowLeft
// BsArrowRight
export default function Pagination({data, cureentPage, increase, reduce}) {
    const [numOfItems , setNumOfItems] = useState(5);
    //currentPage*itmes - items to currentPage * items
    return (
        <div>
            <button onClick={increase}>---)</button>
            <button onClick={reduce}>(---</button>
            <div></div>
        </div>
    )
}