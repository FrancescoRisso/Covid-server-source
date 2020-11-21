import React from "react";

class ChooseRange extends React.Component {
	render() {
		return (
			<div>
				<p>Scegli quante righe vedere:</p>
				<div className="btn-group btn-group-toggle mx-auto" data-toggle="buttons">
					{this.props.range.map((val) => {
						return (
							<label className="btn btn-danger" key={val}>
								<input
									type="radio"
									id={val}
									autoComplete="off"
									{...() => {
										if (val == this.props.number) return "checked";
									}}
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
										} else
											this.props.onclick({
												number: this.props.selection.tot_rows,
												from: 0,
												to: this.props.selection.tot_rows
											});
									}}
								/>
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
