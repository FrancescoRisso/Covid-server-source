import React from "react";
import Graph from "./Graph.js";
import iconI from "../../images/i.svg";
import iconBlank from "../../images/blank.svg";

//Error in the build

class GraphItems extends React.Component {
	constructor(props) {
		super(props);
		this.state = { asTable: false };
	}

	graphSettings = this.props.allGraphs.filter((x) => x.db == this.props.graph_name)[0];

	render() {
		return (
			<div key={this.props.graph_name} className="col-xl-6 pb-5 mt-auto">
				<div
					className="modal fade"
					id={`detailsGraph${this.props.graph_name}`}
					key={`${this.props.graph_name}-modal`}
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h2>{this.graphSettings.name}</h2>{" "}
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<p>{this.graphSettings.description}</p>
								{!this.graphSettings.alwaysPercentage && this.props.percentage ? (
									<>
										<hr />
										<p>
											Sei in modalità "percentuale della popolazione", quindi stai vedendo la
											percentuale {this.graphSettings.short_desc} sul totale della popolazione.
										</p>
										<p>
											In altre parole, il numero {this.graphSettings.short_desc} ogni 100 abitanti
										</p>
									</>
								) : (
									""
								)}
								{this.props.variation ? (
									<>
										<hr />
										<p>
											Sei in modalità "variazione giornaliera", quindi stai vedendo quanto sono
											cambiati (in positivo o negativo) i dati rispetto al giorno precedente
										</p>
									</>
								) : (
									""
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="row px-4 d-flex flex-row align-items-center justify-content-between">
					<table className="col-12">
						<tbody>
							<tr>
								<td>
									<img src={iconBlank} width={20} height={20} fill="#FFFFFF" />
								</td>
								<td className="mx-auto">
									<h1 className="mx-auto">{this.graphSettings.name}</h1>
								</td>
								<td>
									<img
										src={iconI}
										width={20}
										height={20}
										className="hand"
										data-toggle="modal"
										data-target={`#detailsGraph${this.props.graph_name}`}
									/>
								</td>
							</tr>
						</tbody>
					</table>
					<p className="mx-auto">
						{this.graphSettings.name} in Italia oggi:{" "}
						{this.props.variation && this.props.data[this.props.data.length - 1].Italia > 0 ? "+" : ""}
						{this.props.percentage || this.graphSettings.alwaysPercentage
							? this.props.data[this.props.data.length - 1].Italia.toFixed(4)
							: this.props.data[this.props.data.length - 1].Italia}
						{this.graphSettings.alwaysPercentage
							? "%"
							: this.props.percentage
							? "% della popolazione italiana"
							: ""}
						{this.props.variation ? " rispetto a ieri" : ""}.{" "}
						<u
							className="hand"
							onClick={() => {
								this.setState((state) => {
									return { asTable: !state.asTable };
								});
							}}
						>
							Clicca qui
						</u>{" "}
						per {this.state.asTable ? "tornare a vedere il grafico" : "vedere i dati delle regioni"}
					</p>
				</div>
				{this.props.percentage ? (
					<p className={this.graphSettings.alwaysPercentage ? "" : "white-text"}>
						Questo grafico {this.graphSettings.alwaysPercentage ? "non" : ""} è rappresentato come
						percentuale sulla popolazione, in quanto {this.graphSettings.alwaysPercentage ? "" : "non"} è
						già percentuale di suo
					</p>
				) : (
					""
				)}
				{this.props.scale == "Logaritmica" ? (
					<p className={this.graphSettings.alwaysPercentage ? "" : "white-text"}>
						Questo grafico {this.graphSettings.alwaysPercentage ? "non" : ""} è rappresentato in scala
						logaritmica, in quanto {this.graphSettings.alwaysPercentage ? "" : "non"} è una percentuale
					</p>
				) : (
					""
				)}
				{this.state.asTable ? (
					<div className="px-2 mx-auto h-300 table-responsive">
						<table className="mx-auto border red-outline rounded">
							<tbody>
								{this.props.linesList.filter((x) => {
									return x.name != "Italia" && x.show;
								}).length == 0 ? (
									<p className="mt-2 mx-2">Seleziona una o più regioni per vederne i dati di oggi</p>
								) : (
									this.props.linesList.map((region) => {
										if (region.show && region.name != "Italia")
											return (
												<tr>
													<td>
														<span
															className="rounded-pill align-middle mx-2 border border-dark"
															style={{
																backgroundColor: region.color,
																color: region.color,
																fontSize: 5
															}}
														>
															ProvaProva
														</span>
													</td>
													<td className="my-auto align-middle text-left">
														<small>
															<b>{region.name.replace(/-/g, " ").replace("_", "'")}</b>
														</small>
													</td>
													<td>
														<small>
															<b className="pl-2 mr-2">
																{
																	this.props.data[this.props.data.length - 1][
																		region.name
																	]
																}
															</b>
														</small>
													</td>
												</tr>
											);
									})
								)}
							</tbody>
						</table>
					</div>
				) : (
					<Graph
						key={this.props.graph_name}
						percentage={this.props.percentage || this.graphSettings.alwaysPercentage}
						name={this.props.graph_name}
						data={this.props.data}
						linesList={this.props.linesList}
						scale={this.props.scale}
						startDate={this.props.startDate}
						endDate={this.props.endDate}
						ticks={this.props.ticks}
					/>
				)}
			</div>
		);
	}
}

export default GraphItems;
