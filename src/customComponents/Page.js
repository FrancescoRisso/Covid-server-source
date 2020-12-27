import React from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import MainPage from "./MainPage/MainPage";
import Loading from "./Loading";
import Control from "./Control/Control";
import MainMenu from "./MainMenu";

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { mainMenuVisible: false };
	}

	render() {
		return (
			<div className="container-fluid row ml-0 px-0 vheight-100">
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
				/>
				{this.props.loading ? (
					<Loading />
				) : (
					<div className="col-12 px-xl-3">
						<div className="row px-3">
							<MainMenu
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
												changeAppState={this.props.changeAppState}
												percentage={this.props.percentage}
												variation={this.props.variation}
											/>
										</aside>
									) : (
										""
									)}
									<span className={this.props.sidebarVisible ? "col-xl-9 col-md-8 px-0" : "col-12"}>
										<MainPage
											viewMode={this.props.selectedMode}
											data={this.props.data}
											linesList={this.props.linesList}
											percentage={this.props.percentage}
											sidebarVisible={this.props.sidebarVisible}
											startDate={this.props.startDate}
											endDate={this.props.endDate}
											variation={this.props.variation}
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
		);
	}
}

export default Page;
