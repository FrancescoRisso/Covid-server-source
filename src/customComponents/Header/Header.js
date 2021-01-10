/*
description:
	Loads the correct header based on the dimension of the loaded page

state:

props:
	- selectedMode: which mode is currently selected
	- toggleSidebar(): function to invert the visibility of the sidebar
	- sidebarVisible: whether the sidebar is opened
	- otherStuffToDo: anything special that has to be done when opening/closing the sidebar
		!important: if nothing has to be done, please pass an empty function ()=>{}

functions:

imported into:
	- Page
	- App
	- FirstPage

dependences:
	- HeaderContent

*/

import React from "react";
import HeaderContent from "./HeaderContent";

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-12">
				<HeaderContent
					big={true}
					toggleSidebar={this.props.toggleSidebar}
					sidebarVisible={this.props.sidebarVisible}
					selectedMode={this.props.selectedMode}
					otherStuffToDo={this.props.otherStuffToDo}
				/>
				<div className="rounded red-bg mt-2 white-text control-panel p-2 justify-content-center d-md-none">
					<HeaderContent
						big={false}
						toggleSidebar={this.props.toggleSidebar}
						sidebarVisible={this.props.sidebarVisible}
						selectedMode={this.props.selectedMode}
						otherStuffToDo={this.props.otherStuffToDo}
					/>
				</div>
			</div>
		);
	}
}

export default Header;
