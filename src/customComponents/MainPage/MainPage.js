import React from "react";
import Graphs from "./Graphs.js";
import TableRaw from "./TableRaw.js";
import Map from "./Map.js";

class MainPage extends React.Component {
	render() {
		switch (this.props.viewMode) {
			case "graph":
				return (
					<>
						<h2 className="mt-3 mb-4">
							Stai vedendo{" "}
							{this.props.variation ? "la variazione dei dati rispetto al giorno precedente" : "i dati"}{" "}
							dal {this.props.startDate.substr(8, 2)}{" "}
							{this.getMonth(parseInt(this.props.startDate.substr(5, 2)))}{" "}
							{this.props.startDate.substr(0, 4)} al {this.props.endDate.substr(8, 2)}{" "}
							{this.getMonth(parseInt(this.props.endDate.substr(5, 2)))} {this.props.endDate.substr(0, 4)}{" "}
							{this.props.percentage ? "come percentuale sulla popolazione " : ""}
						</h2>
						<div className="row pr-2 pr-xl-5">
							<Graphs
								data={this.props.data}
								linesList={this.props.linesList}
								percentage={this.props.percentage}
								allGraphs={this.props.allGraphs}
								scale={this.props.scale}
								startDate={this.props.startDate}
								endDate={this.props.endDate}
							/>
						</div>
					</>
				);
			case "raw":
				return (
					<>
						<TableRaw name="Dati" data={this.props.data.data} /> <div className="py-5"></div>
						<TableRaw name="Variazione" data={this.props.data.variation} />{" "}
					</>
				);
			case "map":
				const data = Object.keys(this.props.data).map((key) => {
					return { [key]: this.props.data[key][this.props.data[key].length - 1] };
				});
				return (
					<>
						<h3>Mappa delle regioni italiane</h3>
						<h5>
							Passa il mouse o clicca su una delle regioni per vederne
							{this.props.variation ? " la variazione dei dati rispetto al giorno precedente" : " i dati"}
							{this.props.percentage ? ", come percentuale sulla popolazione, " : " "}
							dell'ultimo giorno dell'intervallo selezionato (cioè il {this.props.endDate.substr(
								8,
								2
							)}{" "}
							{this.getMonth(parseInt(this.props.endDate.substr(5, 2)))} {this.props.endDate.substr(0, 4)}
							)
						</h5>
						<i>La colorazione più scura indica una maggiore percentuale della popolazione attualmente positiva</i>
						<p className="d-block d-sm-none">
							Da smartphone la mappa è più complicata da visuaizzare rispetto ad un pc
						</p>
						<Map
							data={data}
							sidebarVisible={this.props.sidebarVisible}
							allGraphs={this.props.allGraphs}
							percentage={this.props.percentage}
						/>
					</>
				);
			default:
				return "";
		}
	}

	getMonth(num) {
		const months = [
			"gennaio",
			"febbraio",
			"marzo",
			"aprile",
			"maggio",
			"giugno",
			"luglio",
			"agosto",
			"settembre",
			"ottobre",
			"novembre",
			"dicembre"
		];
		return months[num - 1];
	}
}

export default MainPage;
