/*

description:
	Displays the header of the page
	
state:
	
props:
	- big: whether the header is displayed on a window classified md or more (refer to bootstrap for sizes)
	- selectedMode: which mode is currently selected
	- toggleSidebar(): function to invert the visibility of the sidebar
	- sidebarVisible: whether the sidebar is opened
	- otherStuffToDo: anything special that has to be done when opening/closing the sidebar
	- lastQuery: the last settings used or "none" if none
	- defaultQueryParams: the default settings for map and graphs view
	
functions:
	- smallerPages
	
imported into:
	- Header
	
dependences:
	- pagesList
	
*/

import React from "react";
import pagesList from "../pagesList";

class HeaderContent extends React.Component {
	smallerPages = ["refs", "initial-page", "map", "us", "what", "err"];

	render() {
		let page = pagesList(this.props.lastQuery, this.props.defaultQueryParams).filter(
			(x) => x.code == this.props.selectedMode
		)[0];
		if (page == null) page = [];

		return (
			<>
				<div
					className={
						this.props.big
							? "rounded red-bg white-text p-2 align-items-center justify-content-center d-none d-md-flex"
							: "col-12 align-items-center d-flex"
					}
				>
					<div className="container-fluid">
						<div className="d-sm-flex d-none">
							<button
								className="btn btn-danger border mr-auto my-auto navbar-dark"
								id="btn-toggle-main-menu"
								onClick={() => {
									let sidebar = document.getElementById("main-menu");
									let page = document.getElementById("main-page");
									if (sidebar.classList.contains("d-block")) {
										sidebar.classList.replace("d-block", "d-none");
										if (this.props.selectedMode != "") page.className = "col-12";
									} else {
										if (this.props.selectedMode != "") {
											if (this.smallerPages.indexOf(this.props.selectedMode) != -1) {
												page.className = "col-12 col-sm-8 col-xl-9";
												sidebar.className =
													"d-block col-sm-4 col-xl-3 col-12 mt-3 bg-light border red-outline mb-auto pb-3";
											} else {
												page.className = "col-12 col-sm-8 col-xl-10";
												sidebar.className =
													"d-block col-sm-4 col-xl-2 col-12 mt-3 bg-light border red-outline mb-auto pb-3";
											}
										}
									}
									this.props.otherStuffToDo();
								}}
							>
								<span className="navbar-toggler-icon"></span>
							</button>
							<span>
								<h1>Dati pandemia Covid-19</h1>
								<h4>{page.length == 0 ? "" : page.title}</h4>
							</span>
							<button className="btn btn-danger ml-auto invisible">
								<span className="navbar-toggler-icon"></span>
							</button>
						</div>
						<div className="d-flex d-sm-none">
							<button
								className="btn btn-danger border mr-auto my-auto navbar-dark"
								onClick={() => {
									let sidebar = document.getElementById("main-menu");
									let page = document.getElementById("main-page");
									if (sidebar.classList.contains("d-block")) {
										sidebar.classList.replace("d-block", "d-none");
										if (this.props.selectedMode != "") page.className = "col-12";
									} else {
										if (this.props.selectedMode != "") {
											if (this.smallerPages.indexOf(this.props.selectedMode) != -1) {
												page.className = "col-12 col-sm-8 col-xl-9";
												sidebar.className =
													"d-block col-sm-4 col-xl-3 col-12 mt-3 bg-light border red-outline mb-auto pb-3";
											} else {
												page.className = "col-12 col-sm-8 col-xl-10";
												sidebar.className =
													"d-block col-sm-4 col-xl-2 col-12 mt-3 bg-light border red-outline mb-auto pb-3";
											}
										}
									}
									this.props.otherStuffToDo();
								}}
							>
								<span className="navbar-toggler-icon"></span>
							</button>
						</div>
						<span className="d-sm-none">
							<h2>Dati pandemia Covid-19</h2>
							<h4>{page.length == 0 ? "" : page.title}</h4>
						</span>
						{["graph", "map"].indexOf(this.props.selectedMode) != -1 ? (
							<div className="row">
								<div className="btn-group mx-auto" role="group" aria-label="Basic example">
									{this.props.selectedMode == "map" ? (
										""
									) : (
										<button
											className="btn btn-danger border"
											type="button"
											onClick={this.props.toggleSidebar}
										>
											{this.props.sidebarVisible
												? "Chiudi menu regioni"
												: "Seleziona regioni e scala"}
										</button>
									)}
									<button
										type="button"
										className="btn btn-danger border"
										data-toggle="modal"
										data-target="#changeData"
										data-keyboard={false}
										data-backdrop="static"
									>
										Cambia dati
									</button>
								</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</>
		);
	}
}

export default HeaderContent;
