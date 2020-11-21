import React from "react";
import { NavLink } from "react-router-dom";

class ModeChoice extends React.Component {
	render() {
		return (
			<NavLink
				className={this.props.checked ? this.props.classes + " active" : this.props.classes}
				type="button"
				to={this.props.goto}
			>
				{this.props.name}
			</NavLink>
		);
	}
}

export default ModeChoice;
