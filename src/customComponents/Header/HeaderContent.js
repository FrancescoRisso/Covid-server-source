import React from "react";
import ModeChooser from "./ModeChooser";
class HeaderContent extends React.Component {
	render() {
		return (
			<>
				<div className={this.props.big ? "d-none" : "col-12"}>
					<h1>Dati pandemia Covid-19</h1>
					<ModeChooser
						selectedMode={this.props.selectedMode}
						modes={this.props.modes}
						lastQuery={this.props.lastQuery}
					/>
				</div>
				<div
					className={
						this.props.big
							? "rounded red-bg mt-2 white-text p-2 align-items-center justify-content-center d-none d-md-flex"
							: "col-12 align-items-center d-flex"
					}
				>
					<button className="btn btn-danger border mr-auto" onClick={this.props.toggleSidebar}>
						{"\u00A0"}
						{this.props.sidebarVisible ? "Chiudi" : "Apri"} menu{"\u00A0"}
					</button>

					<span className={this.props.big ? "" : "d-none"}>
						<h1>Dati pandemia Covid-19</h1>
						<ModeChooser
							selectedMode={this.props.selectedMode}
							modes={this.props.modes}
							lastQuery={this.props.lastQuery}
						/>
					</span>
					<button
						type="button"
						className={
							this.props.selectedMode == "raw"
								? "btn btn-danger border ml-auto invisible"
								: "btn btn-danger border ml-auto"
						}
						data-toggle="modal"
						data-target="#changeData"
					>
						Cambia dati
					</button>
				</div>
			</>
		);
	}
}

export default HeaderContent;
