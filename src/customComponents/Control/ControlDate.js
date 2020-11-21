import React from "react";

class ControlDate extends React.Component {
	render() {
		return (
			<div className="col col-xs-6" key={this.props.date}>
				<label htmlFor={this.props.what}>
					<b>Visualizza i dati {this.props.what == "da" ? "a partire da:" : "fino a:"}</b>
				</label>
				<input
					id={this.props.what}
					className="form-control"
					type="date"
					defaultValue={this.props.date}
					onChange={(ev) => {
						this.props.onUpdate(ev);
					}}
				></input>
			</div>
		);
	}
}

export default ControlDate;
