/*
description:
	Switch to choose between two possibilities

state:

props:
	- labels: an array of two strings containing the text for the two choices
	- isChecked: whether the second option is checked
	- clickEvent: what to do when the choice is changed

functions:

imported into:
	- Control

dependences:

*/

import React from "react";

class ControlSwitch extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<label className="row hand">
				<span className="col my-auto">{this.props.labels[0]}</span>
				<div className="custom-control custom-switch my-auto px-0">
					<span className="switch">
						<input
							type="checkbox"
							checked={this.props.isChecked}
							onChange={(event) => {
								this.props.clickEvent(event.target.checked);
							}}
						/>
						<span className="slider round"></span>
					</span>
				</div>
				<span className="col my-auto">{this.props.labels[1]}</span>
			</label>
		);
	}
}

export default ControlSwitch;
