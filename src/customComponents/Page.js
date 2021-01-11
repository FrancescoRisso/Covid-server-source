/*
description:
	The main page for displaying the data

state:
	- mainMenuVisible: whether the main left menu should be shown

props:
	- currentSettings: the settings that are selected
	- graphsNamesToNum(names, allNames): function for translating the list of names of selected graphs to a string
		of 0s and 1s which represent which graphs in allGraphs should be loaded
	- loading: whether the app is downloading data from the server, in which case it should display the spinner
	- selectedMode: which mode should the page display
	- lastQuery: the last settings used or "none" if none
	- currentScale: the selected scale ("Lineare" or "Logaritmica")
	- linesList: the list of the graph lines, including info about each one's color and visibility
	- changeLinesList(edit): function to change the lines settings in the graphs (edit is the full new settings)
	- allGraphs: the list of all graphs offered by the server
	- data: all the data to be displayed
	- defaultQueryParams: the default settings for map and graphs view
	- toggleSidebar(): function to invert the visibility of the sidebar
	- sidebarVisible: whether the sidebar should be shown

functions:

imported into:
	- App

dependences:
	- Header
	- Sidebar
	- MainPage
	- Loading
	- Control
	- NavMenu

*/

import React from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import MainPage from "./MainPage/MainPage";
import Loading from "./Loading";
import Control from "./Control/Control";
import NavMenu from "./NavMenu";

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { mainMenuVisible: false };
	}

	render() {
		return (
			<div className={`${this.props.selectedMode == "map" ? "container" : "container-fluid ml-0 px-0"} `}>
				<div className="row vheight-100">
					<Header
						selectedMode={this.props.selectedMode}
						toggleSidebar={this.props.toggleSidebar}
						sidebarVisible={this.props.sidebarVisible}
						otherStuffToDo={
							this.props.selectedMode == "map"
								? () => {
										this.setState((state) => {
											return { mainMenuVisible: !state.mainMenuVisible };
										});
								  }
								: () => {}
						}
						lastQuery={this.props.lastQuery}
						defaultQueryParams={this.props.defaultQueryParams}
					/>
					{this.props.loading ? (
						<Loading />
					) : (
						<div className="col-12 px-xl-3">
							<div className="row px-3">
								<NavMenu
									selectedMode={this.props.selectedMode}
									lastQuery={this.props.lastQuery}
									defaultQueryParams={this.props.defaultQueryParams}
									otherStuffToDo={
										this.props.selectedMode == "map"
											? () => {
													this.setState((state) => {
														return { mainMenuVisible: !state.mainMenuVisible };
													});
											  }
											: () => {}
									}
								/>
								<div className="col-12" id="main-page">
									<div className="row">
										{this.props.sidebarVisible ? (
											<aside className="col-12 col-md-4 col-xl-3 d-md-block d-flex align-items-stretch mb-3 mb-sm-0">
												<Sidebar
													selectedMode={this.props.selectedMode}
													lastQuery={this.props.lastQuery}
													currentScale={this.props.currentScale}
													linesList={this.props.linesList}
													changeLinesList={this.props.changeLinesList}
													percentage={this.props.currentSettings.percentage}
													variation={this.props.variation}
												/>
											</aside>
										) : (
											""
										)}
										<span
											className={this.props.sidebarVisible ? "col-xl-9 col-md-8 px-0" : "col-12"}
										>
											<MainPage
												viewMode={this.props.selectedMode}
												data={this.props.data}
												linesList={this.props.linesList}
												percentage={this.props.currentSettings.percentage}
												sidebarVisible={this.props.sidebarVisible}
												startDate={this.props.currentSettings.startDate}
												endDate={this.props.currentSettings.endDate}
												variation={this.props.currentSettings.variation}
												allGraphs={this.props.allGraphs}
												scale={this.props.currentScale}
												mainMenuVisible={this.state.mainMenuVisible}
											/>
										</span>
										{["map", "graph"].indexOf(this.props.selectedMode) != -1 ? (
											<div className="modal fade" id="changeData">
												<Control
													selectedMode={this.props.selectedMode}
													currentSettings={this.props.currentSettings}
													allGraphs={this.props.allGraphs}
													currentScale={this.props.currentScale}
													graphsNamesToNum={this.props.graphsNamesToNum}
												/>
											</div>
										) : (
											""
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Page;
