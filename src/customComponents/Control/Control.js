import React from "react";
import ControlOption from "./ControlOption.js";
import ControlDate from "./ControlDate.js";
import ControlGraphMenu from "./ControlGraphMenu.js";
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
								<ControlGraphMenu
									superSetState={(state) => {
										this.setState(state);
									}}
									selected={this.state.graphs}
									list={this.props.allGraphs.filter((x) => {
										return !x.alwaysPercentage;
									})}
									what="campi"
								/>
								<ControlGraphMenu
									superSetState={(state) => {
										this.setState(state);
									}}
									selected={this.state.graphs}
									list={this.props.allGraphs.filter((x) => {
										return x.alwaysPercentage;
									})}
									what="confronti"
								/>
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
