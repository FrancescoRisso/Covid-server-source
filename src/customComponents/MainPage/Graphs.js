import React from "react";
import GraphItems from "./GraphItems";

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
						<GraphItems
							key={graph_name}
							percentage={this.props.percentage}
							graph_name={graph_name}
							data={this.props.data[graph_name]}
							linesList={this.props.linesList}
							scale={this.props.scale}
							startDate={this.props.startDate}
							endDate={this.props.endDate}
							allGraphs={this.props.allGraphs}
							variation={this.props.variation}
							ticks={this.ticks}
						/>
					);
				})}
			</>
		);
	}
}

export default Graphs;
