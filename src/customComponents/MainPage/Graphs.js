import React from "react";
import Graph from "./Graph.js";

//Error in the build

class Graphs extends React.Component {
	constructor(props) {
		super(props);
	}

	getTicks = () => {
		let ticks = [];
		const endDate = new Date(this.props.endDate);
		let date = new Date(this.props.startDate);
		date = new Date(date.getFullYear(), date.getMonth() + 1, 2);
		while (date < endDate) {
			ticks.push(date.toISOString().substr(0, 10));
			date = new Date(date.getFullYear(), date.getMonth() + 1, 2);
		}
		return ticks;
	};

	ticks = this.getTicks();

	render() {
		return (
			<>
				{Object.keys(this.props.data).map((graph_name) => {
					const graphSettings = this.props.allGraphs.filter((x) => x.db == graph_name)[0];
					return (
						<div key={graph_name} className="col-xl-6 pb-5 mt-auto">
							<h1>{graphSettings.name}</h1>
							{this.props.percentage ? (
								<p className={graphSettings.alwaysPercentage ? "" : "white-text"}>
									Questo grafico {graphSettings.alwaysPercentage ? "non" : ""} è rappresentato come
									percentuale sulla popolazione, in quanto{" "}
									{graphSettings.alwaysPercentage ? "" : "non"} è già percentuale di suo
								</p>
							) : (
								""
							)}
							{this.props.scale == "Logaritmica" ? (
								<p className={graphSettings.alwaysPercentage ? "" : "white-text"}>
									Questo grafico {graphSettings.alwaysPercentage ? "non" : ""} è rappresentato in scala logaritmica, in quanto{" "}
									{graphSettings.alwaysPercentage ? "" : "non"} è una percentuale
								</p>
							) : (
								""
							)}
							<Graph
								percentage={this.props.percentage || graphSettings.alwaysPercentage}
								name={graph_name}
								data={this.props.data[graph_name]}
								linesList={this.props.linesList}
								scale={this.props.scale}
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								ticks={this.ticks}
							/>
						</div>
					);
				})}
			</>
		);
	}
}

export default Graphs;
