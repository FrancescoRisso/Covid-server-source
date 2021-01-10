/*

description:
	Displays the graphs
	
state:
	
props:
	- data: all the data to be displayed
	- linesList: the list of the graph lines, including info about each one's color and visibility
	- percentage: whether the data should be displayed as a percentage
	- allGraphs: the list of all graphs offered by the server
	- scale: the selected scale ("Lineare" or "Logaritmica")
	- startDate: the date from which the data is shown
	- endDate: the date up to which the data is shown
	- variation: whether the graphs contain the variation values (and not the "real" ones)
	
functions:
	- ticks: an array containing the dates shown for the x-axis 
	- getTicks(): returns the ticks above (saved in that variable in order for it to not recalculate them on every render)
	
imported into:
	- MainPage
	
dependences:
	- GraphItems
	
*/

import React from "react";
import GraphItems from "./GraphItems";

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
				{Object.keys(this.props.data).indexOf("Rt") != -1 ? (
					<GraphItems
						key="Rt"
						percentage={this.props.percentage}
						graph_name="Rt"
						data={this.props.data.Rt}
						linesList={this.props.linesList}
						scale={this.props.scale}
						startDate={this.props.startDate}
						endDate={this.props.endDate}
						allGraphs={this.props.allGraphs}
						variation={this.props.variation}
						ticks={this.ticks}
					/>
				) : (
					""
				)}
				{Object.keys(this.props.data)
					.filter((x) => x != "Rt")
					.map((graph_name) => {
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
