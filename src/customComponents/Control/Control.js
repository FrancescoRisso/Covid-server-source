import React from "react";
import ControlOption from "./ControlOption.js";
import ControlDate from "./ControlDate.js";
import { Link } from "react-router-dom";

class Control extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.currentSettings;
	}

	componentDidMount() {
		this.setState({ viewMenu: false });
	}

	render() {
		return (
			<div>
				<h1 className="modal-title">Seleziona i dati da vedere:</h1>
				<hr className="col-12" />
				<form>
					<div className="row px-2">
						<div className="form-group col-12 col-sm-6 col-xl-3">
							<p>
								<b>Che dato vuoi vedere?</b>
							</p>
							<ControlOption
								name="Valori-giornalieri"
								isChecked={!this.state.variation}
								clickEvent={() => {
									this.setState({ variation: false });
								}}
								inputType="radio"
							/>
							<ControlOption
								name="Variazione-giornaliera"
								isChecked={this.state.variation}
								clickEvent={() => {
									this.setState({ variation: true });
								}}
								inputType="radio"
							/>
						</div>
						<div className="d-block d-sm-none col-12">
							<hr />
						</div>
						<div className="form-group col-12 col-sm-6 col-xl-3">
							<p>
								<b>Come lo vuoi vedere?</b>
							</p>
							<ControlOption
								name="Come-dato-numerico"
								isChecked={!this.state.percentage}
								clickEvent={() => {
									this.setState({ percentage: false });
								}}
								inputType="radio"
							/>
							<ControlOption
								name="Come-percentuale"
								isChecked={this.state.percentage}
								clickEvent={() => {
									this.setState({ percentage: true });
								}}
								inputType="radio"
							/>
						</div>
						<div className="d-block d-xl-none col-12">
							<hr />
						</div>
						<div className="form-group col-12 col-sm-6 col-xl-3">
							<p
								className="hand"
								onClick={() => {
									this.setState((state) => {
										return { viewMenu: !state.viewMenu };
									});
								}}
							>
								<b>
									Seleziona i campi che vuoi vedere{" "}
									<span className="py-auto">{this.state.viewMenu ? "▴" : "▾"}</span>
								</b>
							</p>
							<div className={this.state.viewMenu ? "m-2" : "d-none"}>
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
								{this.props.allGraphs.map((field) => {
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
						<div className="d-block d-sm-none col-12">
							<hr />
						</div>
						<div className="form-group col-12 col-sm-6 col-xl-3">
							<div className="row">
								<ControlDate
									what="da"
									date={this.state.startDate}
									onUpdate={(event) => {
										this.setState({ startDate: event.target.value });
									}}
								/>
							</div>
							<div className="row mt-2">
								<ControlDate
									what="a"
									date={this.state.endDate}
									onUpdate={(event) => {
										this.setState({ endDate: event.target.value });
									}}
								/>
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
				</form>
				<Link
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
				>
					<button className="btn btn-secondary" type="button" onClick={this.props.toggleDataChooser}>
						Conferma
					</button>
				</Link>
				<button
					className="btn btn-secondary ml-3"
					type="button"
					onClick={() => {
						this.setState({ viewMenu: false });
						this.setState(this.props.currentSettings);
						this.props.toggleDataChooser();
					}}
				>
					Annulla
				</button>
			</div>
		);
	}
}

export default Control;
