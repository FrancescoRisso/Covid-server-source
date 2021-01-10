/*

description:
	A button with a link
	
state:
	
props:
	- 
	
functions:
	- name: the text in the link
	- classes: the HTML classes this button should have
	- goto: the link thw button should send the user to
	
imported into:
	- Sidebar
	
dependences:
	- NavLink (from react-router-dom)
	
*/

import React from "react";
import { NavLink } from "react-router-dom";

class ModeChoice extends React.Component {
	render() {
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
