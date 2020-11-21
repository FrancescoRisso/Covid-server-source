import React from "react";
import Scroll from "./Scroll.js";
import ChooseRange from "./ChooseRange.js";

class TableRaw extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			from: 0,
			to: 25,
			number: 25,
			tot_rows: Object.keys(props.data).length
		};
	}

	render() {
		return (
			<div className="col-12 scroll">
				<h1>{this.props.name}</h1>
				<p>
					Mostro le righe da {this.state.from} a {this.state.to} di {this.state.tot_rows}{" "}
				</p>
				<div className="d-none d-sm-block">
					<div className="row pb-2">
						<Scroll location="left" data={this.state} onclick={this.changeview} />
						<ChooseRange
							range={[25, 50, 100, 250, 500, "Tutti"]}
							onclick={this.changeview}
							selection={this.state}
						/>
						<Scroll location="right" data={this.state} onclick={this.changeview} />
					</div>
				</div>
				<div className="d-sm-none">
					<ChooseRange
						range={[25, 50, 100, 250, 500, "Tutti"]}
						onclick={this.changeview}
						selection={this.state}
					/>
					<div className="row py-2">
						<Scroll location="left" data={this.state} onclick={this.changeview} />

						<Scroll location="right" data={this.state} onclick={this.changeview} />
					</div>
				</div>

				<table className="table table-sm table-striped">
					<thead>
						<tr>
							<th key="data">Data</th>
							<th key="regione">Regione</th>
							{Object.keys(this.props.data[0]).map((key) => {
								if (key != "Data" && key != "Regione")
									return <th key={key}>{key.replace(/_/g, " ")}</th>;
							})}
						</tr>
					</thead>
					<tbody>
						{this.props.data.slice(this.state.from, this.state.to).map((row, index) => {
							return (
								<tr key={index}>
									{
										<>
											<td key="data">{new Date(row.Data).toLocaleDateString()}</td>
											<td key="regione">{row.Regione.replace(/-/g, " ").replace("_", "'")}</td>
											{Object.keys(row).map((value) => {
												if (value != "Data" && value != "Regione") {
													if (this.props.name == "Variazione") {
														return (
															<td key={value}>
																{row[value] <= 0 ? row[value] : `+${row[value]}`}
															</td>
														);
													} else return <td key={value}>{row[value]}</td>;
												}
											})}
										</>
									}
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="row pb-2">
					<Scroll location="left" data={this.state} onclick={this.changeview} />
					<Scroll location="right" data={this.state} onclick={this.changeview} />
				</div>
			</div>
		);
	}

	changeview = (obj) => {
		this.setState(obj);
	};
}

export default TableRaw;
