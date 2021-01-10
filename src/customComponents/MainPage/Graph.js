/*

description:
	The real graph
	
state:
	
props:
	- percentage: whether the data should be displayed as a percentage
	- name: the name of the graph
	- data: all the data to be displayed for this graph
	- linesList: the list of the graph lines, including info about each one's color and visibility
	- scale: the selected scale ("Lineare" or "Logaritmica")
	- ticks: an array containing the dates to show on the x-axis
	- variation: whether the graph contains the variation values (and not the "real" ones)
	
functions:
	
imported into:
	- GraphItems
	
dependences:
	- Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer (from recharts)
	
*/

import React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

class Graph extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={this.props.data}>
					<CartesianGrid stroke="#ccc" />
					{this.props.name == "Rt" ? (
						<Line dataKey="soglia" key="one" stroke="#B42828" dot={false} strokeWidth={2} />
					) : this.props.variation ? (
						<Line dataKey="zero" key="zero" stroke="#B42828" dot={false} strokeWidth={2} />
					) : (
						""
					)}
					{this.props.linesList.map((region) => {
						if (region.show)
							return <Line dataKey={region.name} key={region.name} stroke={region.color} dot={false} />;
					})}
					<XAxis
						dataKey="data"
						ticks={this.props.ticks}
						angle={-45}
						textAnchor="end"
						height={90}
						interval={0}
					/>
					{this.props.percentage ? (
						<YAxis unit="%" />
					) : this.props.scale == "Lineare" ? (
						this.props.name == "Rt" ? (
							<YAxis type="number" domain={[-0.5, 2.5]} allowDataOverflow={true} />
						) : (
							<YAxis />
						)
					) : (
						<YAxis
							scale="log"
							domain={[
								(min) => {
									if (this.props.name == "Rt") return 0.1;
									if (min > 0) return min;
									else return 1;
								},
								(max) => {
									return parseInt(max * 1.1);
								}
							]}
							type="number"
							allowDataOverflow={true}
						/>
					)}
					<Tooltip
						formatter={(label) => {
							if (this.props.name == "Rt") return label.toFixed(4);
							if (this.props.percentage) return label.toFixed(4) + "%";
							return label;
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	}
}

export default Graph;
