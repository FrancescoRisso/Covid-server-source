import React from "react";

class ControlOption extends React.Component {
	render() {
		return (
			<div className="form-check hand">
				<input
					onClick={this.props.clickEvent}
					className="form-check-input hand py-auto"
					type={this.props.inputType}
					id={this.props.name}
					checked={this.props.isChecked}
					onChange={() => {}}
				></input>
				<label htmlFor={this.props.name} className="my-auto form-check-label hand">
					{this.props.name.replace(/-/g, " ")}
				</label>
			</div>
		);
	}
}

export default ControlOption;
