import React from "react";
import SidebarItem from "./SidebarItem.js";
import ModeChoice from "../ModeChoice";

const graphSettings = ["Lineare", "Logaritmica"];

class Sidebar extends React.Component {
	filterFunc = (item) => {
		if (this.props.percentage || this.props.table == "VARIAZIONE") return item != "Logaritmica";
		else return true;
	};

	render() {
		switch (this.props.selectedMode) {
			case "raw":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<p className="my-3">Non ci sono altre impostazioni per la modalià "Database"</p>
					</div>
				);

			case "map":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<p className="my-3">Non ci sono altre impostazioni per la modalià "Mappa"</p>
					</div>
				);
			case "graph":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<h6>Scegli una scala: </h6>
						<div className="btn-group mb-2" role="group">
							{graphSettings
								.filter((x) => this.filterFunc(x))
								.map((item) => {
									return (
										<ModeChoice
											key={item}
											name={item}
											classes="btn btn-outline-danger"
											goto={`${this.props.lastQuery.slice(0, -4)}&l=${
												item == "Lineare" ? "0" : "1"
											}`}
										/>
									);
								})}
						</div>
						<h6>Visualizza i dati di:</h6>
						<table className="mx-auto mt-2">
							<tbody>
								<SidebarItem
									item={this.props.linesList.find((x) => x.name == "Italia")}
									linesList={this.props.linesList}
									changeAppState={this.props.changeAppState}
									key="Italia"
								/>
								{this.props.linesList.map((item) => {
									if (item.name != "Italia")
										return (
											<SidebarItem
												item={item}
												linesList={this.props.linesList}
												changeAppState={this.props.changeAppState}
												key={item.name}
											/>
										);
								})}
							</tbody>
						</table>
						<button
							className="btn btn-small red-text"
							onClick={() => {
								this.props.changeAppState({
									linesList: this.props.linesList.map((item) => {
										return {
											name: item.name,
											show: true,
											color: item.color
										};
									})
								});
							}}
						>
							<small>
								<b>Mostra tutti</b>
							</small>
						</button>
					</div>
				);
		}
	}
}

export default Sidebar;
