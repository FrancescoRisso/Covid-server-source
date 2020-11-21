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
					{this.props.linesList.map((region) => {
						if (region.show)
							return <Line dataKey={region.name} key={region.name} stroke={region.color} dot={false} />;
					})}
					<CartesianGrid stroke="#ccc" />
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
						<YAxis />
					) : (
						<YAxis
							scale="log"
							domain={[
								(min) => {
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
					<Tooltip />
				</LineChart>
			</ResponsiveContainer>
		);
	}
}

export default Graph;
