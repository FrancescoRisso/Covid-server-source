/*
description:
	A togglable on/off option

state:

props:
	- name: the name to be displayed
	- isChecked: whether the option should be checked
	- clickEvent: what to do when the option is clicked

functions:

imported into:
	- ControlGraphMenu

dependences:

*/

import React from "react";

class ControlOption extends React.Component {
	render() {
		return (
			<div className="form-check hand my-2">
				<input
					onClick={this.props.clickEvent}
					className="form-check-input hand py-auto"
					type="checkbox"
					id={this.props.name}
					checked={this.props.isChecked}
					onChange={() => {}}
				></input>
				<label htmlFor={this.props.name} className="my-auto form-check-label hand">
					{this.props.name.replace()}
				</label>
			</div>
		);
	}
}

export default ControlOption;
