/*
description:
	Calendar to choose a date for the start/end of the selection

state:

props:
	- what: "da" or other if it is to choose respectively the starting or ending date of the selection
	- date: the date which is displayed when component is rendered
	- onUpdate: what to do when the calendar is out of focus (so the date has been chosen)

functions:

imported into:
	- Control

dependences:

*/

import React from "react";

class ControlDate extends React.Component {
	render() {
		return (
			<div className="col col-xs-6" key={this.props.date}>
				<label htmlFor={this.props.what}>
					<b>Visualizza i dati {this.props.what == "da" ? "a partire da:" : "fino a:"}</b>
				</label>
				<input
					id={this.props.what}
					className="form-control"
					type="date"
					defaultValue={this.props.date}
					onBlur={(ev) => {
						this.props.onUpdate(ev);
					}}
				></input>
			</div>
		);
	}
}

export default ControlDate;
