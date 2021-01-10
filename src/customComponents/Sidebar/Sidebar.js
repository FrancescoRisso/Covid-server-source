/*

description:
	A sidebar for choosing the scale and the lines of the graphs
	
state:
	
props:
	- selectedMode: which mode is currently selected
	- lastQuery: the last settings used or "none" if none
	- currentScale: the selected scale ("Lineare" or "Logaritmica")
	- linesList: the list of the graph lines, including info about each one's color and visibility
	- changeLinesList(edit): function to change the lines settings in the graphs (edit is the full new settings)
	- percentage: whether the graphs are displayed as percentages or not
	- variation: whether the graphs contain the variation values (and not the "real" ones)
	
functions:
	- graphSettings[]: the possible choices for the graphs scale
	- filterFunc(item): returns whether the logarithmic scale should be choosable or not
	
imported into:
	- Page
	
dependences:
	- SidebarItem
	- ModeChoice
	
*/

import React from "react";
import SidebarItem from "./SidebarItem.js";
import ModeChoice from "../ModeChoice";

const graphSettings = ["Lineare", "Logaritmica"];

class Sidebar extends React.Component {
	filterFunc = (item) => {
		if (this.props.percentage || this.props.variation) return item != "Logaritmica";
		else return true;
	};

	render() {
		switch (this.props.selectedMode) {
			case "raw":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<p className="my-3 mt-3">Non ci sono altre impostazioni per la modalià "Database"</p>
					</div>
				);

			case "map":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<p className="my-3 mt-3">Non ci sono altre impostazioni per la modalià "Mappa"</p>
					</div>
				);
			case "graph":
				return (
					<div className="border red-outline red-text vheight-100 rounded mt-3 col">
						<h6 className="mt-3">Visualizza i dati di:</h6>
						<table className="mx-auto mt-2">
							<tbody>
								<SidebarItem
									item={this.props.linesList.find((x) => x.name == "Italia")}
									linesList={this.props.linesList}
									changeLinesList={this.props.changeLinesList}
									key="Italia"
								/>
								{this.props.linesList.map((item) => {
									if (item.name != "Italia")
										return (
											<SidebarItem
												item={item}
												linesList={this.props.linesList}
												changeLinesList={this.props.changeLinesList}
												key={item.name}
											/>
										);
								})}
							</tbody>
						</table>
						<button
							className="btn btn-small red-text"
							onClick={() => {
								this.props.changeLinesList(
									this.props.linesList.map((item) => {
										return {
											name: item.name,
											show: true,
											color: item.color
										};
									})
								);
							}}
						>
							<small>
								<b>Mostra tutti</b>
							</small>
						</button>
						<hr />
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
											goto={`/graph${this.props.lastQuery.slice(0, -4)}/l/${
												item == "Lineare" ? "0" : "1"
											}`}
										/>
									);
								})}
						</div>
					</div>
				);
		}
	}
}

export default Sidebar;
