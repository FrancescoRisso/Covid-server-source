import React from "react";
import { NavLink } from "react-router-dom";

class ModeChoice extends React.Component {
	render() {
		//console.log(`${this.props.name} ${this.props.goto}`)
		return (
			<NavLink
				className={this.props.classes}
				activeClassName="active"
				type="button"
				to={this.props.goto}
				exact={true}
				isActive={(match, location) => {
					return location.pathname + location.search == this.props.goto;
				}}
			>
				{this.props.name}
			</NavLink>
		);
	}
}

export default ModeChoice;
