/*
description:
	A menu to choose which graphs to show

state:

props:
	- superSetState: function to edit the parent's state
	- selected: which graphs are currently selected
	- list: the list of all possible graphs
	- what: the name to be displayed
	- toggle: a function to toggle the visibility of the menu (controlled by its parent)
	- open: whether the menu should be opened or not

functions:

imported into:
	- Control

dependences:
	- ControlOption

*/

import React from "react";
import ControlOption from "./ControlOption";

class ControlGraphMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group col-12 col-sm-6">
				<p className="hand" onClick={this.props.toggle}>
					<b>
						Seleziona i {this.props.what} che vuoi vedere{" "}
						<span className="py-auto">{this.props.open ? "▴" : "▾"}</span>
					</b>
				</p>
				<div className={this.props.open ? "m-2" : "d-none"}>
					<p>
						<u
							className="hand"
							onClick={() => {
								let graphs = this.props.selected;
								this.props.list.forEach((item) => {
									if (graphs.indexOf(item.db) == -1) graphs.push(item.db);
								});
								this.props.superSetState({ graphs: graphs });
							}}
						>
							Seleziona tutti
						</u>
						{" - "}
						<u
							className="hand"
							onClick={() => {
								this.props.superSetState({
									graphs: this.props.selected.filter((x) => {
										return (
											this.props.list
												.map((x) => {
													return x.db;
												})
												.indexOf(x) == -1
										);
									})
								});
							}}
						>
							Deseleziona tutti
						</u>
					</p>
					{this.props.list.map((field) => {
						return (
							<ControlOption
								key={field.name}
								name={`${field.name}`}
								isChecked={this.props.selected.indexOf(field.db) != -1}
								clickEvent={() => {
									const index = this.props.selected.indexOf(field.db);
									let graphs = this.props.selected;
									if (index != -1) graphs.splice(index, 1);
									else graphs.push(field.db);
									this.props.superSetState({ graphs: graphs });
								}}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}

export default ControlGraphMenu;
