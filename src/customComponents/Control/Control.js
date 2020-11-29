import React from "react";
import ControlOption from "./ControlOption.js";
import ControlDate from "./ControlDate.js";
import { Redirect } from "react-router-dom";

class Control extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.currentSettings;
	}

	componentDidMount() {
		this.setState({ viewMenu1: false, viewMenu2: false, confirm: false });
	}

	render() {
		if (this.state.confirm) {
			this.setState({ confirm: false });
			return (
				<Redirect
					className="white-text"
					to={`/${this.props.selectedMode}?p=${this.state.percentage ? "1" : "0"}&v=${
						this.state.variation ? "1" : "0"
					}&g=${this.props.graphsNamesToNum(this.state.graphs, this.props.allGraphs).join("")}&fd=${
						this.state.startDate
					}&td=${this.state.endDate}&l=${
						this.props.currentScale == "Lineare"
							? "0"
							: this.state.percentage || this.state.variation
							? "0"
							: "1"
					}`}
				/>
			);
		}
		return (
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title">Seleziona i dati da vedere:</h1>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<form>
							<div className="row px-2">
								<div className="form-group col">
									<p>
										<b>Che dato vuoi vedere?</b>
									</p>
									<ControlOption
										name="Valori giornalieri (es. il numero di persone positive ogni giorno)"
										isChecked={!this.state.variation}
										clickEvent={() => {
											this.setState({ variation: false });
										}}
										inputType="radio"
									/>
									<ControlOption
										name="Variazione giornaliera (es. la differenza tra il numero di persone positive oggi e ieri)"
										isChecked={this.state.variation}
										clickEvent={() => {
											this.setState({ variation: true });
										}}
										inputType="radio"
									/>
								</div>
								<div className="form-group col">
									<p>
										<b>Come lo vuoi vedere?</b>
									</p>
									<ControlOption
										name="Come dato numerico (es. il numero di persone positive)"
										isChecked={!this.state.percentage}
										clickEvent={() => {
											this.setState({ percentage: false });
										}}
										inputType="radio"
									/>
									<ControlOption
										name="Come percentuale della popolazione (es. il tot% della popolazione era positivo in quel giorno)"
										isChecked={this.state.percentage}
										clickEvent={() => {
											this.setState({ percentage: true });
										}}
										inputType="radio"
									/>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="form-group col-12">
									<div className="row">
										<div className="col">
											<ControlDate
												what="da"
												date={this.state.startDate}
												onUpdate={(event) => {
													this.setState({ startDate: event.target.value });
												}}
											/>
										</div>
										<div className="col">
											<ControlDate
												what="a"
												date={this.state.endDate}
												onUpdate={(event) => {
													this.setState({ endDate: event.target.value });
												}}
											/>
										</div>
									</div>
									<p
										className="hand mt-2"
										onClick={() => {
											const date = new Date(Date.now());
											this.setState({
												startDate: "2020-02-24",
												endDate: date.toISOString().substr(0, 10)
											});
										}}
									>
										<u>Visualizza da inzio pandemia a oggi</u>
									</p>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="form-group col-12 col-sm-6">
									<p
										className="hand"
										onClick={() => {
											this.setState((state) => {
												return { viewMenu1: !state.viewMenu1 };
											});
										}}
									>
										<b>
											Seleziona i campi che vuoi vedere{" "}
											<span className="py-auto">{this.state.viewMenu1 ? "▴" : "▾"}</span>
										</b>
									</p>
									<div className={this.state.viewMenu1 ? "m-2" : "d-none"}>
										<p>
											<u
												className="hand"
												onClick={() => {
													this.setState({
														graphs: this.props.allGraphs.map((item) => {
															return item.db;
														})
													});
												}}
											>
												Seleziona tutti
											</u>
											{" - "}
											<u
												className="hand"
												onClick={() => {
													this.setState({ graphs: [] });
												}}
											>
												Deseleziona tutti
											</u>
										</p>
										{this.props.allGraphs
											.filter((x) => {
												return !x.alwaysPercentage;
											})
											.map((field) => {
												return (
													<ControlOption
														key={field.name}
														name={`${field.name}${field.alwaysPercentage ? " *" : ""}`}
														isChecked={this.state.graphs.indexOf(field.db) != -1}
														inputType="checkbox"
														clickEvent={() => {
															const index = this.state.graphs.indexOf(field.db);
															let graphs = this.state.graphs;
															if (index != -1) graphs.splice(index, 1);
															else graphs.push(field.db);
															this.setState({ graphs: graphs });
														}}
													/>
												);
											})}
									</div>
								</div>
								<div className="form-group col-12 col-sm-6">
									<p
										className="hand"
										onClick={() => {
											this.setState((state) => {
												return { viewMenu2: !state.viewMenu2 };
											});
										}}
									>
										<b>
											Seleziona i confronti che vuoi vedere{" "}
											<span className="py-auto">{this.state.viewMenu2 ? "▴" : "▾"}</span>
										</b>
									</p>
									<div className={this.state.viewMenu2 ? "m-2" : "d-none"}>
										<p>
											<u
												className="hand"
												onClick={() => {
													this.setState({
														graphs: this.props.allGraphs.map((item) => {
															return item.db;
														})
													});
												}}
											>
												Seleziona tutti
											</u>
											{" - "}
											<u
												className="hand"
												onClick={() => {
													this.setState({ graphs: [] });
												}}
											>
												Deseleziona tutti
											</u>
										</p>
										{this.props.allGraphs
											.filter((x) => {
												return x.alwaysPercentage;
											})
											.map((field) => {
												return (
													<ControlOption
														key={field.name}
														name={field.name}
														isChecked={this.state.graphs.indexOf(field.db) != -1}
														inputType="checkbox"
														clickEvent={() => {
															const index = this.state.graphs.indexOf(field.db);
															let graphs = this.state.graphs;
															if (index != -1) graphs.splice(index, 1);
															else graphs.push(field.db);
															this.setState({ graphs: graphs });
														}}
													/>
												);
											})}
									</div>
								</div>
								<p className="mx-auto">
									<small>
										I campi del secondo menu sono indipendenti dall'opzione "Come percentuale della
										popolazione"
									</small>
								</p>
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<button
							className="btn btn-secondary"
							type="button"
							data-dismiss="modal"
							data-target="#changeData"
							onClick={() => {
								this.setState({ confirm: true });
							}}
						>
							Conferma
						</button>

						<button
							className="btn btn-secondary ml-3"
							type="button"
							onClick={() => {
								this.setState({ viewMenu1: false, viewMenu2: false });
								this.setState(this.props.currentSettings);
							}}
							data-dismiss="modal"
							data-target="#changeData"
						>
							Annulla
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Control;
