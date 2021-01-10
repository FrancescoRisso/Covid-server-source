/*
description:
	The first page you see when you open the website

state:
	- totWidth: the total width of the container of the page
	- btnWidth: the width of every button in the page
	- inBetweenSpace: space between two buttons
	- count: number of buttons per row
	- buttons: the list of settings of the buttons

props:
	- toggleSidebar(): function to invert the visibility of the sidebar
	- sidebarVisible: whether the sidebar should be shown
	- lastQuery: the last settings used or "none" if none
	- defaultQueryParams: the default settings for map and graphs view

functions: 
	- range(start, stop, step): returns an array of numbers: every [step] numbers starting from [start] up to [stop]
	- updateDimension(): calculate all the dimensions of the components basing on the dimension of the page
	- componentDidMount(): add resize eventListener
	- componentDidUpdate(): compute again pagesList if the links change
	- componentWillUnmount(): remove resize eventListener

imported into:
	- App

dependences:
	- Header
	- MainMenu
	- pagesList
	- FirstPageButton

*/

import React from "react";
import Header from "../../Header/Header";
import MainMenu from "../../NavMenu";
import pagesList from "../../pagesList";
import FirstPageButton from "./FirstPageButton";

class FirstPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			totWidth: 0,
			btnWidth: 0,
			inBetweenSpace: 0,
			count: 0,
			buttons: pagesList(props.lastQuery, props.defaultQueryParams).filter((x) => x.inMainPage)
		};
	}

	range = (start, stop, step) => {
		return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
	};

	updateDimension = () => {
		const total = document.getElementById("main-page").getBoundingClientRect().width;
		const button = total <= 500 ? 110 : 150;
		const count = total >= 740 ? 3 : 2;
		const inBetweenSpace = Math.floor((total - 30 - count * button) / (3 + count));

		this.setState({
			totWidth: total,
			btnWidth: button,
			inBetweenSpace: inBetweenSpace,
			count: count
		});
	};

	componentDidMount() {
		window.addEventListener("resize", this.updateDimension);
		this.updateDimension();
	}

	componentDidUpdate(lastProps) {
		if (
			lastProps.lastQuery != this.props.lastQuery ||
			this.props.defaultQueryParams != lastProps.defaultQueryParams
		) {
			this.setState({
				buttons: pagesList(this.props.lastQuery, this.props.defaultQueryParams).filter((x) => x.inMainPage)
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimension);
	}

	render() {
		return (
			<div className="container">
				<Header
					toggleSidebar={this.props.toggleSidebar}
					sidebarVisible={this.props.sidebarVisible}
					selectedMode="initial-page"
					otherStuffToDo={this.updateDimension}
				/>
				<div className="col-12">
					<div className="row mx-0">
						<MainMenu
							selectedMode="initial-page"
							lastQuery={this.props.lastQuery}
							defaultQueryParams={this.props.defaultQueryParams}
						/>
						<div id="main-page" className="col-12">
							{this.state.btnWidth == 0
								? ""
								: this.range(
										0,
										this.state.buttons.length,
										this.state.count == 0 ? 1 : this.state.count
								  ).map((item, index, array) => {
										if (index == 0) return "";
										return (
											<div key={item}>
												{this.state.buttons.slice(array[index - 1], item).map((button, i) => {
													return (
														<FirstPageButton
															generalSettings={this.state}
															buttonSettings={button}
															number={i}
															key={i}
														/>
													);
												})}
											</div>
										);
								  })}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default FirstPage;
