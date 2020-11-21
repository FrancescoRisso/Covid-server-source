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
					return (
						<div key={graph_name} className="col-xl-6 pb-5 mt-auto">
							<h1>{this.props.allGraphs.filter((x) => x.db == graph_name)[0].name}</h1>
							<Graph
								percentage={this.props.percentage}
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
