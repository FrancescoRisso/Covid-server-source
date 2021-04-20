/*

description:
	Displays the map
	
state:
	- selected: which region is selected ("" if none)
	- mouseX: X coordinate of the mouse pointer
	- mouseY: Y coordinate of the mouse pointer
	- dx: needed horizontal shift
	- positivesPercentages[]: the percentage of positive people in each region, to show as a color on the map
	
props:
	- data: all the data to be displayed
	- sidebarVisible: whether the sidebar is visible
	- allGraphs: the list of all graphs offered by the server
	- percentage: whether the data should be displayed as a percentage
	- mainMenuVisible: whether the main left menu is displayed or not
	
functions:
	- componentDidMount(): update the css files for the colours and calculate the needed dx
	- componentDidUpdate(lastProps): calculate the needed dx
	
imported into:
	- MainPage
	
dependences:
	- VectorMap (from reac-vector-maps)
	- ItalyMap (static json)
	- api.js (for api calls)
	
*/

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
			dy: 0,
			positivesPercentages: []
		};
	}

	updateDimensions = () => {
		const delta = document.getElementById("map-div").getBoundingClientRect();
		this.setState({ dx: delta.left <= 30 ? 15 : delta.left });
	};

	componentDidUpdate(lastProps) {
		if (
			lastProps.sidebarVisible != this.props.sidebarVisible ||
			lastProps.mainMenuVisible != this.props.mainMenuVisible
		) {
			this.updateDimensions();
		}
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	componentDidMount() {
		this.updateDimensions();

		window.addEventListener("resize", this.updateDimensions);
		window.addEventListener("scroll", (e) => {
			//console.log(document.getElementById("map-div").scrollHeight);
			this.setState({ dy: window.scrollY });
		});

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
					const perc = this.state.positivesPercentages[region] / percMax;
					const red = perc < 0.5 ? 255 : Math.round((1 - 2 * (perc - 0.5)) * 200 + 55);
					const gb = perc < 0.5 ? Math.round((1 - 2 * perc) * 200 + 55) : 0;
					cssFile.insertRule(`.${region} { fill: rgb(${red}, ${gb}, ${gb}); stroke: black; }`);
				});
		});
	}

	render() {
		return (
			<div className="mt-3">
				<div
					id="map-div"
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
						top: this.state.mouseY + this.state.dy,
						left: this.state.mouseX - this.state.dx,
						transform: `translate(-50%, -195%)`
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
