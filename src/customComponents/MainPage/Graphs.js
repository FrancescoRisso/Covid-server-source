import React from "react";
import Graph from "./Graph.js";
import iconI from "../../images/i.svg";
import iconBlank from "../../images/blank.svg";

//Error in the build

class Graphs extends React.Component {
	constructor(props) {
		super(props);
	}

	getTicks = () => {
		let ticks = [];
		const endDate = new Date(this.props.endDate);
		let date = new Date(this.props.startDate);
		date = new Date(date.getFullYear(), date.getMonth() + 1, 2);
		while (date < endDate) {
			ticks.push(date.toISOString().substr(0, 10));
			date = new Date(date.getFullYear(), date.getMonth() + 1, 2);
		}
		return ticks;
	};

	ticks = this.getTicks();

	render() {
		return (
			<>
				{Object.keys(this.props.data).map((graph_name) => {
					const graphSettings = this.props.allGraphs.filter((x) => x.db == graph_name)[0];
					return (
						<div key={graph_name} className="col-xl-6 pb-5 mt-auto">
							<div className="modal fade" id={`detailsGraph${graph_name}`} key={`${graph_name}-modal`}>
								<div className="modal-dialog">
									<div className="modal-content">
										<div className="modal-header">
											<h2>{graphSettings.name}</h2>{" "}
											<button
												type="button"
												className="close"
												data-dismiss="modal"
												aria-label="Close"
											>
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div className="modal-body">
											<p>{graphSettings.description}</p>
											{!graphSettings.alwaysPercentage && this.props.percentage ? (
												<>
													<hr />
													<p>
														Sei in modalità "percentuale della popolazione", quindi stai
														vedendo la percentuale {graphSettings.short_desc} sul totale
														della popolazione.
													</p>
													<p>
														In altre parole, il numero {graphSettings.short_desc} ogni 100
														abitanti
													</p>
												</>
											) : (
												""
											)}
											{this.props.variation ? (
												<>
													<hr />
													<p>
														Sei in modalità "variazione giornaliera", quindi stai vedendo
														quanto sono cambiati (in positivo o negativo) i dati rispetto al
														giorno precedente
													</p>
												</>
											) : (
												""
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="row px-4">
								<img src={iconBlank} width={20} height={20} className="my-auto" fill="#FFFFFF" />
								<h1 className="inline mx-auto">{graphSettings.name}</h1>
								<img
									src={iconI}
									width={20}
									height={20}
									className="my-auto hand"
									data-toggle="modal"
									data-target={`#detailsGraph${graph_name}`}
								/>
							</div>
							{this.props.percentage ? (
								<p className={graphSettings.alwaysPercentage ? "" : "white-text"}>
									Questo grafico {graphSettings.alwaysPercentage ? "non" : ""} è rappresentato come
									percentuale sulla popolazione, in quanto{" "}
									{graphSettings.alwaysPercentage ? "" : "non"} è già percentuale di suo
								</p>
							) : (
								""
							)}
							{this.props.scale == "Logaritmica" ? (
								<p className={graphSettings.alwaysPercentage ? "" : "white-text"}>
									Questo grafico {graphSettings.alwaysPercentage ? "non" : ""} è rappresentato in
									scala logaritmica, in quanto {graphSettings.alwaysPercentage ? "" : "non"} è una
									percentuale
								</p>
							) : (
								""
							)}
							<Graph
								key={graph_name}
								percentage={this.props.percentage || graphSettings.alwaysPercentage}
								name={graph_name}
								data={this.props.data[graph_name]}
								linesList={this.props.linesList}
								scale={this.props.scale}
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								ticks={this.ticks}
							/>
						</div>
					);
				})}
			</>
		);
	}
}

export default Graphs;
