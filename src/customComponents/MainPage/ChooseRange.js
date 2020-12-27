import React from "react";

class ChooseRange extends React.Component {
	constructor(props) {
		super(props);
		this.state = { alert: false };
	}
	render() {
		return (
			<div>
				{this.state.alert ? <Alert variant="danger">Test</Alert> : ""}
				<p>Scegli quante righe vedere:</p>
				<div className="btn-group btn-group-toggle mx-auto" data-toggle="buttons">
					{this.props.range.map((val) => {
						return (
							<label
								className={
									val == this.props.number ? "btn btn-danger active hand" : "btn btn-danger hand"
								}
								key={val}
								id={`${this.props.name}-${val}`}
								onClick={() => {
									if (val != "Tutti") {
										let from = this.props.selection.from;
										let to = from + val;
										if (to > this.props.selection.tot_rows) {
											to = this.props.selection.tot_rows;
											from = to - val;
										}
										this.props.onclick({
											number: val,
											from: from,
											to: to
										});
									} else if (
										confirm(
											"Caricare tutti i dati potrebbe far crashare il browser.\nSei sicuro di voler visualizzare tutti i dati?"
										)
									)
										this.props.onclick({
											number: this.props.selection.tot_rows,
											from: 0,
											to: this.props.selection.tot_rows
										});
									else {
										setTimeout(() => {
											document.getElementById(`${this.props.name}-${this.props.number}`).click();
										}, 1);
									}
								}}
							>
								<input type="radio" id={val} autoComplete="off" />
								{val}
							</label>
						);
					})}
				</div>
			</div>
		);
	}
}

export default ChooseRange;
