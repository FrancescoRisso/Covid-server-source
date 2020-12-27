import React from "react";
class HeaderContent extends React.Component {
	render() {
		return (
			<>
				<div
					className={
						this.props.big
							? "rounded red-bg mt-2 white-text p-2 align-items-center justify-content-center d-none d-md-flex"
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
											if (this.props.selectedMode == "initial-page") {
												page.className = "col-12 col-sm-8 col-xl-9";
												sidebar.className =
													"d-block col-sm-4 col-xl-3 col-12 mt-3 bg-light border red-outline";
											} else {
												page.className = "col-12 col-sm-8 col-xl-10";
												sidebar.className =
													"d-block col-sm-4 col-xl-2 col-12 mt-3 bg-light border red-outline";
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
							</span>
							<button className="btn btn-danger ml-auto invisible">
								<span className="navbar-toggler-icon"></span>
							</button>
						</div>
						<div className="d-flex d-sm-none">
							<button className="btn btn-danger border mr-auto my-auto navbar-dark">
								<span className="navbar-toggler-icon"></span>
							</button>
						</div>
						<span className="d-sm-none">
							<h2>Dati pandemia Covid-19</h2>
						</span>
						{["graph", "map"].indexOf(this.props.selectedMode) != -1 ? (
							<div className="row">
								<div className="btn-group mx-auto" role="group" aria-label="Basic example">
									<button
										className="btn btn-danger border"
										type="button"
										onClick={this.props.toggleSidebar}
									>
										{this.props.sidebarVisible
											? "Chiudi menu regioni"
											: "Seleziona regioni e scala"}
									</button>
									<button
										type="button"
										className="btn btn-danger border"
										data-toggle="modal"
										data-target="#changeData"
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
