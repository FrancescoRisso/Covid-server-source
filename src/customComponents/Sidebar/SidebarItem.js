import React from "react";
import imgCrossedEye from "../../images/invisible.svg";
import imgEye from "../../images/visible.svg";
import imgBorderedEye from "../../images/onlyThis.svg";

class SidebarItem extends React.Component {
	render() {
		return (
			<tr>
				<td>
					<span
						className="rounded-pill align-middle mr-2 border border-dark"
						style={{
							backgroundColor: this.props.item.color,
							color: this.props.item.color,
							fontSize: 5
						}}
					>
						ProvaProva
					</span>
				</td>
				<td className="my-auto align-middle text-left">
					<small>
						<b>{this.props.item.name.replace(/-/g, " ").replace("_", "'")}</b>
					</small>
				</td>
				<td>
					<button
						className="btn btn-sm"
						onClick={() => {
							this.props.changeAppState({
								linesList: this.props.linesList.map((item) => {
									if (this.props.item.name != item.name) return item;
									else {
										return {
											name: this.props.item.name,
											show: !this.props.item.show,
											color: this.props.item.color
										};
									}
								})
							});
						}}
					>
						<img
							height={18}
							width={18}
							src={this.props.item.show ? imgEye : imgCrossedEye}
							alt={this.props.item.show ? "Nascondi" : "Mostra"}
							data-toggle="tooltip"
							title={this.props.item.show ? "Nascondi" : "Mostra"}
						></img>
					</button>
				</td>
				<td>
					<button
						className="btn btn-sm"
						onClick={() => {
							this.props.changeAppState({
								linesList: this.props.linesList.map((item) => {
									if (this.props.item.name != item.name)
										return {
											name: item.name,
											show: false,
											color: item.color
										};
									else {
										return {
											name: item.name,
											show: true,
											color: item.color
										};
									}
								})
							});
						}}
					>
						<img
							height={18}
							width={18}
							src={imgBorderedEye}
							alt="Solo questo"
							data-toggle="tooltip"
							title="Mostra solo questo"
						></img>
					</button>
				</td>
			</tr>
		);
	}
}

export default SidebarItem;
