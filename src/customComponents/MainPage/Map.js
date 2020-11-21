import React from "react";
import { VectorMap } from "@south-paw/react-vector-maps";
import ItalyMap from "./italy-map.js";
import * as Api from "../../api.js";

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "",
			mouseX: 0,
			mouseY: 0,
			dx: 0,
			positivesPercentages: []
		};
	}

	componentDidUpdate(lastProps) {
		if (lastProps.sidebarVisible != this.props.sidebarVisible) {
			const delta = document.getElementById("map-div").getBoundingClientRect();
			this.setState({ dx: delta.left <= 30 ? 15 : delta.left });
		}
	}

	componentDidMount() {
		const delta = document.getElementById("map-div").getBoundingClientRect();
		this.setState({ dx: delta.left <= 30 ? 15 : delta.left });

		const cssFile = document.styleSheets[1];

		const today = new Date(Date.now()).toISOString().substr(0, 10);
		const yesterday = new Date(Date.now() - 864e5 * 2).toISOString().substr(0, 10);

		Api.getGraphs(yesterday, today, ["Positivi"], "STORICO", true).then((data) => {
			this.setState({ positivesPercentages: data.Positivi[data.Positivi.length - 1] });

			const percMax = Math.max(
				...Object.keys(this.state.positivesPercentages)
					.filter((x) => x != "data")
					.map((region) => {
						return parseFloat(this.state.positivesPercentages[region]);
					})
			);

			Object.keys(this.state.positivesPercentages)
				.filter((x) => x != "data")
				.map((region) => {
					const color = 255 * (1 - this.state.positivesPercentages[region] / percMax);
					cssFile.insertRule(`.${region} { fill: rgb(${Math.round(color)}, 0, 0); stroke: black; }`);
				});
		});
	}

	render() {
		return (
			<div className="mt-3">
				<div
					id="map-div"
					className="vheight-100"
					onMouseMove={(event) => {
						this.setState({ mouseX: event.clientX, mouseY: event.clientY });
					}}
				>
					<VectorMap
						height={window.innerHeight * 0.7}
						{...ItalyMap}
						layerProps={{
							onMouseEnter: ({ target }) => {
								let targetName;
								if (target.attributes.name.value == "San Marino") targetName = "Emilia-Romagna";
								else {
									if (target.attributes.name.value == "Vatican City") targetName = "Lazio";
									else targetName = target.attributes.name.value;
								}
								this.setState({ selected: targetName });
							},
							onMouseLeave: () => {
								this.setState({ selected: "" });
							}
						}}
					/>
				</div>
				<div
					className={this.state.selected != "" ? "border rounded red-outline d-block white-color" : "d-none"}
					style={{
						position: "absolute",
						top: this.state.mouseY - 80,
						left: this.state.mouseX - this.state.dx,
						transform: `translateX(-50%)`
					}}
				>
					<p>
						<small>{this.state.selected.replace(/-/g, " ")}</small>
					</p>
					{this.state.selected != ""
						? this.props.data.map((prop) => {
								return (
									<p className="px-2 no-space" key={Object.keys(prop)[0]}>
										<small>
											{this.props.allGraphs.filter((x) => x.db == Object.keys(prop)[0])[0].name}:{" "}
											{
												prop[Object.keys(prop)[0]][
													this.state.selected.replace(/ /g, "-").replace("'", "_")
												]
											}
											{this.props.percentage ? " %" : ""}
										</small>
									</p>
								);
						  })
						: ""}
				</div>
			</div>
		);
	}
}

export default Map;
