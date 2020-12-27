import React from "react";
import { Link } from "react-router-dom";

class FirstPageButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const firstInLine = this.props.number % this.props.generalSettings.count == 0;
		const lastInLine = (this.props.number + 1) % this.props.generalSettings.count == 0;
		return (
			<span
				className="d-inline-flex mt-5"
				style={{
					width: this.props.generalSettings.btnWidth,
					height: this.props.generalSettings.btnWidth,
					marginLeft: firstInLine
						? 2 * this.props.generalSettings.inBetweenSpace
						: this.props.generalSettings.inBetweenSpace,
					marginRight: lastInLine ? 2 * this.props.generalSettings.inBetweenSpace : 0
				}}
			>
				<span>
					<Link
						to={this.props.buttonSettings.link}
						className="btn btn-default border p-0 d-flex"
						style={{
							width: this.props.generalSettings.btnWidth,
							height: this.props.generalSettings.btnWidth
						}}
					>
						<img
							className="m-auto"
							src={this.props.buttonSettings.image}
							width={this.props.generalSettings.btnWidth - 12}
							height={this.props.generalSettings.btnWidth - 12}
						/>
					</Link>
					<p className="inline">{this.props.buttonSettings.title}</p>
				</span>
			</span>
		);
	}
}

export default FirstPageButton;
