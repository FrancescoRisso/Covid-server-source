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
