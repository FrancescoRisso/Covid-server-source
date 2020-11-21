import React from "react";
import ModeChoice from "../ModeChoice";

class ModeChooser extends React.Component {
	render() {
		return (
			<div className="btn-group mb-2 my-sm-auto" role="group">
				{this.props.modes.map((item) => {
					return (
						<ModeChoice
							key={item.name}
							name={item.name}
							checked={this.props.selectedMode == item.code}
							classes="btn btn-danger border"
							goto={item.code == "raw" ? `${item.code}` : `/${item.code}${this.props.lastQuery}`}
						/>
					);
				})}
			</div>
		);
	}
}

export default ModeChooser;
