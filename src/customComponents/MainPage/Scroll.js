/*

description:
	A couple of buttons to navigate a table: next/last page or prev/first page (depending on the props)
	
state:
	
props:
	- location: where in the page ("right" or "left") the buttons are (this also changes the behaviour, as in the description)
	- data: which rows the table are currently being shown (starting row, ending row, total number of rows, number of displayed rows)
	- onclick(): function to update the settings in the parent's memory
	
functions:
	
imported into:
	- TableRaw
	
dependences:
	
*/

import React from "react";

class Scroll extends React.Component {
	render() {
		if (this.props.location == "right") {
			return (
				<div className="ml-auto my-auto">
					<button
						className={
							this.props.data.to != this.props.data.tot_rows
								? "btn btn-danger"
								: "btn btn-danger invisible"
						}
						onClick={() => {
							let from = this.props.data.from + this.props.data.number;
							let to = from + this.props.data.number;
							if (to > this.props.data.tot_rows) to = this.props.data.tot_rows;
							this.props.onclick({ to: to, from: from });
						}}
					>
						{"-->"}
					</button>
					<button
						className={
							this.props.data.to != this.props.data.tot_rows
								? "btn btn-danger ml-2"
								: "btn btn-danger ml-2 invisible"
						}
						onClick={() => {
							let to = this.props.data.tot_rows;
							let from = to - this.props.data.number;
							if (from < 0) to = 0;
							this.props.onclick({ to: to, from: from });
						}}
					>
						{"==>"}
					</button>
				</div>
			);
		} else {
			if (this.props.location == "left") {
				return (
					<div className="mr-auto my-auto">
						<button
							className={
								this.props.data.from != 0 ? "btn btn-danger mr-2" : "btn btn-danger mr-2 invisible"
							}
							onClick={() => {
								let from = 0;
								let to = from + this.props.data.number;
								if (to > this.props.data.tot_rows) to = this.props.data.tot_rows;
								this.props.onclick({ to: to, from: from });
							}}
						>
							{"<=="}
						</button>
						<button
							className={this.props.data.from != 0 ? "btn btn-danger" : "btn btn-danger invisible"}
							onClick={() => {
								let from = this.props.data.from - this.props.data.number;
								if (from < 0) from = 0;
								let to = from + this.props.data.number;
								this.props.onclick({ to: to, from: from });
							}}
						>
							{"<--"}
						</button>
					</div>
				);
			} else return "";
		}
	}
}

export default Scroll;
