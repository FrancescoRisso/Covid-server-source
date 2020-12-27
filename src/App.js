import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import "./App.css";
import * as Api from "./api.js";
import Page from "./customComponents/Page";
import Header from "./customComponents/Header/Header";
import MainMenu from "./customComponents/MainMenu";
import FirstPage from "./customComponents/discoursivePages/FirstPage/FirstPage";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lastQuery: "none",
			loading: true,
			data: {},
			allGraphs: [],
			linesList: [],
			currentMode: "",
			defaultQueryParams: "",
			sidebarVisible: false
		};
	}

	render() {
		return (
			<Router>
				<div className="App container-fluid px-xl-3 vheight-100">
					<Switch>
						<Route exact path="/">
							<FirstPage
								toggleSidebar={this.toggleSidebar}
								sidebarVisible={this.state.sidebarVisible}
								lastQuery={this.state.lastQuery}
								defaultQueryParams={this.state.defaultQueryParams}
							/>
						</Route>
						<Route
							path="/graph"
							render={(props) => {
								if (this.state.allGraphs.length !== 0)
									this.updateSettings(props.location.search, "graph");
								return (
									<Page
										currentSettings={{
											graphs: this.settings.graphNames(),
											startDate: this.settings.startDate(),
											endDate: this.settings.endDate(),
											variation: this.settings.variation(),
											percentage: this.settings.percentage()
										}}
										graphsNamesToNum={this.graphsNamesToNum}
										loading={
											this.state.allGraphs.length === 0 ||
											this.state.loading ||
											this.state.currentMode != "graph"
										}
										selectedMode="graph"
										lastQuery={this.state.lastQuery}
										currentScale={this.settings.logarithmic() ? "Logaritmica" : "Lineare"}
										linesList={this.state.linesList}
										changeAppState={this.changeState}
										percentage={this.settings.percentage()}
										startDate={this.settings.startDate()}
										endDate={this.settings.endDate()}
										variation={this.settings.variation()}
										allGraphs={this.state.allGraphs}
										data={this.state.data}
										defaultQueryParams={this.state.defaultQueryParams}
										toggleSidebar={this.toggleSidebar}
										sidebarVisible={this.state.sidebarVisible}
									/>
								);
							}}
						/>
						<Route
							path="/map"
							render={(props) => {
								if (this.state.allGraphs.length !== 0)
									this.updateSettings(props.location.search, "map");
								return (
									<Page
										currentSettings={{
											graphs: this.settings.graphNames(),
											startDate: this.settings.startDate(),
											endDate: this.settings.endDate(),
											variation: this.settings.variation(),
											percentage: this.settings.percentage()
										}}
										graphsNamesToNum={this.graphsNamesToNum}
										loading={
											this.state.allGraphs.length === 0 ||
											this.state.loading ||
											this.state.currentMode != "map"
										}
										selectedMode="map"
										lastQuery={this.state.lastQuery}
										currentScale={this.settings.logarithmic() ? "Logaritmica" : "Lineare"}
										linesList={this.state.linesList}
										changeAppState={this.changeState}
										percentage={this.settings.percentage()}
										startDate={this.settings.startDate()}
										endDate={this.settings.endDate()}
										variation={this.settings.variation()}
										allGraphs={this.state.allGraphs}
										data={this.state.data}
										defaultQueryParams={this.state.defaultQueryParams}
										toggleSidebar={this.toggleSidebar}
										sidebarVisible={this.state.sidebarVisible}
									/>
								);
							}}
						/>
						<Route
							path="/raw"
							render={() => {
								if (this.state.allGraphs.length !== 0) this.pushRawData();
								return (
									<Page
										loading={
											this.state.allGraphs.length === 0 ||
											this.state.loading ||
											this.state.currentMode != "raw"
										}
										selectedMode="raw"
										data={this.state.data}
										lastQuery={this.state.defaultQueryParams}
										defaultQueryParams={this.state.defaultQueryParams}
										toggleSidebar={this.toggleSidebar}
										sidebarVisible={this.state.sidebarVisible}
									/>
								);
							}}
						/>
						<Route>
							<Header
								selectedMode={""}
								toggleSidebar={this.toggleSidebar}
								sidebarVisible={this.state.sidebarVisible}
								lastQuery={this.props.lastQuery}
							/>
							<p className="mt-2">Errore: pagina non trovata</p>
							<MainMenu
								selectedMode=""
								lastQuery={this.state.lastQuery}
								defaultQueryParams={this.state.defaultQueryParams}
							/>
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}

	toggleSidebar = () => {
		this.setState((state) => {
			return { sidebarVisible: !state.sidebarVisible };
		});
	};

	defaultGraphs = ["Positivi", "Nuovi_positivi"];

	allDbDownloaded = false;

	changeState = (edit) => {
		this.setState(edit);
	};

	/* When the query is different from the last one, updates the settings */
	updateSettings = (queryParams, mode) => {
		this.allDbDownloaded = false;
		if (this.state.currentMode != mode) this.setState({ currentMode: mode });
		if (queryParams != "" && queryParams != this.state.lastQuery) {
			this.setState({ loading: true });
			const settings = {};
			JSON.stringify(queryParams)
				.replace(/"/g, "")
				.replace("?", "")
				.split("&")
				.forEach((item) => {
					settings[item.split("=")[0]] = item.split("=")[1];
				});

			this.settings.update(
				{
					startDate: settings.fd,
					endDate: settings.td == "auto" ? new Date(Date.now()).toISOString().substr(0, 10) : settings.td,
					percentage: settings.p == "1",
					variation: settings.v == "1",
					graphs: settings.g,
					logarithmic: settings.l == "1"
				},
				this.state.allGraphs
			);

			let updateLinesList = false;
			if (this.state.linesList.length == 0) updateLinesList = true;

			if (queryParams.slice(0, -4) != this.state.lastQuery.slice(0, -4)) this.pushData(updateLinesList);
			else this.setState({ loading: false });
			this.setState({ lastQuery: queryParams });
		}
	};

	pushRawData = () => {
		if (!this.allDbDownloaded) {
			this.allDbDownloaded = true;
			this.setState({ loading: true, currentMode: "raw" });
			Api.getRawData().then((data) => {
				this.setState({ data: data, lastQuery: "", loading: false });
			});
		}
	};

	/* Collects the data from the API and pushes it to the state */
	pushData(updateLinesList) {
		if (this.settings.graphNames().length != 0) {
			Api.getGraphs(
				this.settings.startDate(),
				this.settings.endDate(),
				this.settings.graphNames(),
				this.settings.variation() ? "VARIAZIONE" : "STORICO",
				this.settings.percentage()
			).then((data) => {
				let lines;
				if (updateLinesList) lines = this.getLinesList(data);
				else lines = this.state.linesList;

				this.setState({ data: data, loading: false, linesList: lines });
			});
		}
	}

	getLinesList = (data) => {
		let array = Object.keys(data[Object.keys(data)[0]][0]);
		array.splice(array.indexOf("data"), 1);
		return array.map((region) => {
			let color;
			switch (region) {
				case "Abruzzo":
					color = "#C00000";
					break;
				case "Basilicata":
					color = "#FF0000";
					break;
				case "Calabria":
					color = "#C55A11";
					break;
				case "Campania":
					color = "#FF9900";
					break;
				case "Emilia-Romagna":
					color = "#FFD966";
					break;
				case "Friuli-Venezia-Giulia":
					color = "#9FBA16";
					break;
				case "Lazio":
					color = "#548235";
					break;
				case "Liguria":
					color = "#004C00";
					break;
				case "Lombardia":
					color = "#009A46";
					break;
				case "Marche":
					color = "#0A7C66";
					break;
				case "Molise":
					color = "#08B896";
					break;
				case "Piemonte":
					color = "#00B0F0";
					break;
				case "Puglia":
					color = "#0070C0";
					break;
				case "Sardegna":
					color = "#3333CC";
					break;
				case "Sicilia":
					color = "#002060";
					break;
				case "Toscana":
					color = "#7030A0";
					break;
				case "Trentino-Alto-Adige":
					color = "#993366";
					break;
				case "Umbria":
					color = "#D60093";
					break;
				case "Valle-d_Aosta":
					color = "#FF00FF";
					break;
				case "Veneto":
					color = "#FF7DFF";
					break;
				default:
					color = "#000";
					break;
			}

			if (region == "Italia") {
				return {
					name: region,
					show: true,
					color: color
				};
			} else {
				return {
					name: region,
					show: false,
					color: color
				};
			}
		});
	};

	/* Transforms an array of graph names into a string of 0 and 1 representing the original array */
	graphsNamesToNum = (names, allNames) => {
		return allNames.map((graph) => {
			if (names.includes(graph.db)) return 1;
			else return 0;
		});
	};

	/* Transforms  a string of 0 and 1 into the array of graph names represented by the original string */
	graphsNumToNames = (num, allNames) => {
		const names = [];
		num.split("").forEach((digit, index) => {
			if (digit == "1") names.push(allNames[index].db);
		});
		return names;
	};

	/* Gets the list of possible fields when component is mounted */
	componentDidMount() {
		Api.getFieldsList().then((fields) => {
			this.setState({
				allGraphs: fields.list,
				defaultQueryParams: `?p=0&v=0&g=${this.graphsNamesToNum(this.defaultGraphs, fields.list).join(
					""
				)}&fd=${"2020-02-24"}&td=auto&l=0`
			});
		});
	}

	/* The settings not inserted into the state */
	settings = (() => {
		let settings = {};
		return {
			startDate: () => {
				return settings.startDate;
			},
			endDate: () => {
				return settings.endDate;
			},
			graphs: function () {
				return settings.graphs;
			},
			graphNames: () => {
				return settings.graphNames;
			},
			percentage: () => {
				return settings.percentage;
			},
			variation: function () {
				return settings.variation;
			},
			logarithmic: function () {
				return settings.logarithmic;
			},
			update: (newSettings, allGraphs) => {
				settings = newSettings;
				settings.graphNames = this.graphsNumToNames(newSettings.graphs, allGraphs);
			}
		};
	})();
}

export default App;
