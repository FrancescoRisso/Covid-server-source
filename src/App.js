/*
description:
	The main component of the website that redirects you to every page

state:
	- sidebarVisible: whether the sidebar should be shown

props:

functions:
	- allGraphs[]: the list of all graphs offered by the server
	- defaultQueryParms: the default settings for map and graphs view
	- lastQuery: the last settings used or "none" if none
	- data{}: all the data downloaded from the server
	- isDbDownloaded: if data contains the full database or not
	- isGraphdataLoaded: if data contains a map/graph query result
	- linesList[]: the list of the graph lines, including info about each one's color and visibility
	- defaultGraphs[]: the names of the graphs shown by default
	- error: if the return of the api function is erroneous
	- isDataLoading: if the data is being loaded at the moment

	- toggleSidebar(): inverts the visibility of the sidebar
	- changeLinesList(edit): ovverrides linesList with edit
	- getLinesList(data): calculates linesList and returns it (does not directly update it). Needs to receive the data from the database
	- graphsNamesToNum(names, allNames): translates the list of names of selected graphs to a string of 0s and 1s which represent which graphs in allGraphs should be loaded
	- graphsNumToNames(num, allNames): translates the string of 0s and 1s as above back to the array (this compression is for shorting the url)
	- loadData(params, thisQuery): loads the required data from the api server

imported into:

dependences:
	- api.js (for api calls)
	- BrowserRouter, Switch, Route (from react-router-dom)
	- App.css (for css styling)
	- Page
	- DiscursivePage

*/

import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import * as Api from "./api.js";
import Page from "./customComponents/Page";
import FirstPage from "./customComponents/discursivePages/FirstPage";
import DiscursivePage from "./customComponents/discursivePages/DiscursivePage";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sidebarVisible: false
		};
	}

	allGraphs = [];
	defaultQueryParams = "";
	lastQuery = "none";
	data = {};
	isDbLoaded = false;
	isGraphdataLoaded = false;
	linesList = [];
	error = false;
	isDataLoading = false;

	render() {
		if (this.allGraphs.length == 0) {
			Api.getFieldsList().then((fields) => {
				this.allGraphs = fields.list;
				this.defaultQueryParams = `/p/0/v/0/g/${this.graphsNamesToNum(this.defaultGraphs, fields.list).join(
					""
				)}/fd/${"2020-02-24"}/td/auto/s/0/l/0`;
				this.forceUpdate();
			});
			return "";
		} else
			return (
				<Router>
					<div className="App container-fluid px-0 px-sm-3 px-xl-3 vheight-100">
						<Switch>
							<Route
								exact
								path="/"
								render={() => {
									document.body.style.backgroundColor = "#f5c6cb";
									return (
										<div className="vheight-100 pinky-bg rounded">
											<FirstPage
												toggleSidebar={this.toggleSidebar}
												sidebarVisible={this.state.sidebarVisible}
												lastQuery={this.lastQuery}
												defaultQueryParams={this.defaultQueryParams}
											/>
										</div>
									);
								}}
							/>
							<Route
								path="/graph/p/:percentage/v/:variation/g/:graphnum/fd/:fromDate/td/:toDate/s/:smooth/l/:logScale"
								render={({ match }) => {
									document.body.style.backgroundColor = "#ffffff";
									const params = match.params;
									const thisQuery = `/p/${params.percentage}/v/${params.variation}/g/${params.graphnum}/fd/${params.fromDate}/td/${params.toDate}/s/${params.smooth}/l/${params.logScale}`;
									if (this.error) {
										this.error = false;
										return <Redirect push={true} to="/ServerError" />;
									}
									if (
										(thisQuery.slice(0, -4) != this.lastQuery.slice(0, -4) ||
											!this.isGraphdataLoaded ||
											this.error) &&
										!this.isDataLoading
									) {
										this.loadData(params, thisQuery);
									}
									if(this.isDataLoading) return <Page loading={true} selectedMode="graph" />
									return (
										<Page
											currentSettings={{
												graphs: this.graphsNumToNames(params.graphnum, this.allGraphs),
												startDate: params.fromDate,
												endDate:
													params.toDate == "auto"
														? new Date(Date.now()).toISOString().substr(0, 10)
														: params.toDate,
												variation: params.variation == "1",
												percentage: params.percentage == "1",
												smooth: params.smooth == "1"
											}}
											graphsNamesToNum={this.graphsNamesToNum}
											loading={false}
											selectedMode="graph"
											lastQuery={this.lastQuery}
											currentScale={params.logScale == "1" ? "Logaritmica" : "Lineare"}
											linesList={this.linesList}
											changeLinesList={this.changeLinesList}
											allGraphs={this.allGraphs}
											data={this.data}
											defaultQueryParams={this.defaultQueryParams}
											toggleSidebar={this.toggleSidebar}
											sidebarVisible={this.state.sidebarVisible}
										/>
									);
								}}
							/>
							<Route
								path="/map/p/:percentage/v/:variation/g/:graphnum/fd/:fromDate/td/:toDate/s/:smooth/l/:logScale"
								render={({ match }) => {
									document.body.style.backgroundColor = "#f5c6cb";
									const params = match.params;
									const thisQuery = `/p/${params.percentage}/v/${params.variation}/g/${params.graphnum}/fd/${params.fromDate}/td/${params.toDate}/s/${params.smooth}/l/${params.logScale}`;
									if (this.error) {
										this.error = false;
										return <Redirect push={true} to="/ServerError" />;
									}
									if (
										(thisQuery.slice(0, -4) != this.lastQuery.slice(0, -4) ||
											!this.isGraphdataLoaded ||
											this.error) &&
										!this.isDataLoading
									) {
										this.loadData(params, thisQuery);
									}
									if(this.isDataLoading) return <Page loading={true} selectedMode="map" />
									return (
										<Page
											currentSettings={{
												graphs: this.graphsNumToNames(params.graphnum, this.allGraphs),
												startDate: params.fromDate,
												endDate:
													params.toDate == "auto"
														? new Date(Date.now()).toISOString().substr(0, 10)
														: params.toDate,
												variation: params.variation == "1",
												percentage: params.percentage == "1",
												smooth: params.smooth == "1"
											}}
											graphsNamesToNum={this.graphsNamesToNum}
											loading={false}
											selectedMode="map"
											lastQuery={this.lastQuery}
											currentScale={params.logScale == "1" ? "Logaritmica" : "Lineare"}
											linesList={this.linesList}
											changeLinesList={this.changeLinesList}
											allGraphs={this.allGraphs}
											data={this.data}
											defaultQueryParams={this.defaultQueryParams}
											toggleSidebar={this.toggleSidebar}
											sidebarVisible={this.state.sidebarVisible}
										/>
									);
								}}
							/>
							<Route
								path="/raw"
								render={() => {
									document.body.style.backgroundColor = "#ffffff";
									if (!this.isDbLoaded) {
										this.data = this.falseData;
										Api.getRawData().then((result) => {
											this.data = result;
											this.isDbLoaded = true;
											this.isGraphdataLoaded = false;
											this.forceUpdate();
										});
										return <Page loading={true} />;
									}
									return (
										<Page
											loading={false}
											selectedMode="raw"
											data={this.data}
											lastQuery={this.lastQuery}
											defaultQueryParams={this.defaultQueryParams}
											toggleSidebar={() => {}}
											sidebarVisible={false}
											currentSettings={{}}
										/>
									);
								}}
							/>
							<Route
								render={({ location }) => {
									document.body.style.backgroundColor = "#f5c6cb";
									return (
										<DiscursivePage
											lastQuery={this.lastQuery}
											defaultQueryParams={this.defaultQueryParams}
											path={location.pathname}
											graphsList={this.allGraphs}
										/>
									);
								}}
							/>
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

	defaultGraphs = ["Positivi", "Nuovi_positivi", "Rt"];

	changeLinesList = (edit) => {
		this.linesList = edit;
		this.forceUpdate();
	};

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

	loadData = (params, thisQuery) => {
		this.isDataLoading = true;
		this.data = {};
		var toLoad = Object.fromEntries(
			this.graphsNumToNames(params.graphnum, this.allGraphs).map((g) => [g, "notDone"])
		);
		var graphNames = Object.keys(toLoad);
		let i;
		if ((i = graphNames.indexOf("Rt")) != -1) [graphNames[i], graphNames[0]] = [graphNames[0], graphNames[i]];
		graphNames.forEach((graph) => {
			Api.getGraphs(
				params.fromDate,
				params.toDate == "auto" ? new Date(Date.now()).toISOString().substr(0, 10) : params.toDate,
				graph,
				params.variation == "1" ? "VARIAZIONE" : "STORICO",
				params.percentage == "1",
				params.smooth == "1"
			)
				.then((result) => {
					this.data[graph] = result[graph];
					if (this.linesList.length == 0) this.linesList = this.getLinesList(result);
					this.lastQuery = thisQuery;
					toLoad[graph] = "ok";
					if (graphNames.filter((x) => toLoad[x] != "ok").length == 0) {
						this.isGraphdataLoaded = true;
						this.error = false;
						this.isDataLoading = false;
						this.forceUpdate();
					}
					this.isDbLoaded = false;
				})
				.catch((e) => {
					console.log(e);
					this.error = true;
					this.forceUpdate();
				});
		});
	};
}

export default App;
