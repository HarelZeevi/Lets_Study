import React, { useState } from 'react';

const compareDates = (sqlDate, pickedDate) => {
	let date = new Date(sqlDate.split('T')[0])
	console.log(date + ", " + pickedDate)
	if (date.getYear() == pickedDate.getYear() &&
		date.getMonth() == pickedDate.getMonth() &&
		date.getDate() == pickedDate.getDate())
		return true;
	return false;
}

export default function TimePicker(props) {
	console.log(props.listTimes)
	console.log(typeof props.listTimes === 'undefined')
	if (typeof props.listTimes === 'undefined' || props.listTimes == [])
		return (
				<div> </div>
		)
	else
		{
   		return (
        	<select className="dropdown-subject-list">
        		{props.listTimes.map(cal => {
	    			if (compareDates(cal.availabledate, props.pickedDate))
						return (
								<option>
            						{cal.starttime + " - " + cal.endtime}
          						</option>
								)
        			})
				}
    
      		</select>
    			)
		}
}

