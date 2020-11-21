import React from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import MainPage from "./MainPage/MainPage";
import Loading from "./Loading";
import Control from "./Control/Control";

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataChooserVisible: false,
			sidebarVisible: false
		};
	}

	render() {
		return (
			<div className="container-fluid row ml-0 px-0 vheight-100">
				<Header
					selectedMode={this.props.selectedMode}
					toggleSidebar={this.toggleSidebar}
					sidebarVisible={this.state.sidebarVisible}
					toggleDataChooser={this.toggleDataChooser}
					lastQuery={this.props.lastQuery}
				/>
				{this.props.loading ? (
					<Loading />
				) : (
					<>
						{this.state.sidebarVisible ? (
							<aside className="col-12 col-md-4 col-xl-3 d-md-block d-flex align-items-stretch mb-3 mb-sm-0">
								<Sidebar
									selectedMode={this.props.selectedMode}
									lastQuery={this.props.lastQuery}
									currentScale={this.props.currentScale}
									linesList={this.props.linesList}
									changeAppState={this.props.changeAppState}
								/>
							</aside>
						) : (
							""
						)}
						<span className={this.state.sidebarVisible ? "col-xl-9 col-md-8 px-0" : "col-12"}>
							{this.state.dataChooserVisible ? (
								<div className="border rounded red-outline my-3 pb-2">
									<Control
										selectedMode={this.props.selectedMode}
										currentSettings={this.props.currentSettings}
										allGraphs={this.props.allGraphs}
										currentScale={this.props.currentScale}
										graphsNamesToNum={this.props.graphsNamesToNum}
										toggleDataChooser={this.toggleDataChooser}
									/>
								</div>
							) : (
								""
							)}
							<MainPage
								viewMode={this.props.selectedMode}
								data={this.props.data}
								linesList={this.props.linesList}
								percentage={this.props.percentage}
								sidebarVisible={this.state.sidebarVisible}
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								variation={this.props.variation}
								allGraphs={this.props.allGraphs}
								scale={this.props.currentScale}
							/>
						</span>
					</>
				)}
			</div>
		);
	}

	toggleDataChooser = () => {
		this.setState((state) => {
			return { dataChooserVisible: !state.dataChooserVisible };
		});
	};

	toggleSidebar = () => {
		this.setState((state) => {
			return { sidebarVisible: !state.sidebarVisible };
		});
	};
}

export default Page;
