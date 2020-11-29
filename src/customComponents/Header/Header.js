import React from "react";
import HeaderContent from "./HeaderContent";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modes: [
				{ code: "raw", name: "Database" },
				{ code: "graph", name: "Grafici" },
				{ code: "map", name: "Mappa" }
			]
		};
	}

	render() {
		return (
			<div className="col-12">
				<HeaderContent
					big={true}
					toggleSidebar={this.props.toggleSidebar}
					sidebarVisible={this.props.sidebarVisible}
					selectedMode={this.props.selectedMode}
					modes={this.state.modes}
					lastQuery={this.props.lastQuery}
				/>
				<div className="rounded red-bg mt-2 white-text control-panel p-2 justify-content-center d-md-none">
					<HeaderContent
						big={false}
						toggleSidebar={this.props.toggleSidebar}
						sidebarVisible={this.props.sidebarVisible}
						selectedMode={this.props.selectedMode}
						modes={this.state.modes}
						lastQuery={this.props.lastQuery}
					/>
				</div>
			</div>
		);
	}
}

export default Header;
