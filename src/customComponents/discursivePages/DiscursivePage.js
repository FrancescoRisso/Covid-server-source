/*

description:
	The general discursive page, with the header, the menu and the content
	
state:
	
props:
	- lastQuery: the last settings used or "none" if none
	- defaultQueryParams: the default settings for map and graphs view
	- path: the link of the visited page
	- graphsList: the list of all graphs served by the server
	
functions:
	
imported into:
	- App
	
dependences:
	- References
	- AboutUs
	- Header
	- NavMenu
	- WhatWeShow
	- pagesList
	- Redirect (from react-router-dom)

*/

import React from "react";
import References from "./References";
import AboutUs from "./AboutUs";
import Header from "../Header/Header";
import NavMenu from "../NavMenu";
import WhatWeShow from "./WhatWeShow";
import pagesList from "../pagesList";
import { Redirect } from "react-router-dom";

class DiscursivePage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let code = pagesList(this.props.lastQuery, this.props.defaultQueryParams).filter(
			(x) => x.link == this.props.path
		);
		if (code.length == 1) {
			code = code[0].code;
		} else {
			code = "err";
		}
		return (
			<div className="container vheight-100 white-bg">
				<Header
					toggleSidebar={this.props.toggleSidebar}
					sidebarVisible={this.props.sidebarVisible}
					selectedMode={code}
					otherStuffToDo={() => {}}
				/>
				<div className="col-12">
					<div className="row mx-0">
						<NavMenu
							selectedMode={code}
							lastQuery={this.props.lastQuery}
							defaultQueryParams={this.props.defaultQueryParams}
							otherStuffToDo={() => {}}
						/>
						<div id="main-page" className="col-12">
							<div className="col-12 discoursive">
								{this.props.path.startsWith("/aboutUs") ? (
									this.props.path == "/aboutUs" ? (
										<AboutUs />
									) : (
										<Redirect to="/aboutUs" />
									)
								) : this.props.path.startsWith("/refs") ? (
									this.props.path == "/refs" ? (
										<References />
									) : (
										<Redirect to="/refs" />
									)
								) : this.props.path.startsWith("/what") ? (
									this.props.path == "/what" ? (
										<WhatWeShow graphsList={this.props.graphsList} />
									) : (
										<Redirect to="/what" />
									)
								) : this.props.path == "/ServerError" ? (
									<p className="mt-2 center">Errore del server</p>
								) : (
									<p className="mt-2 center">Errore: pagina non trovata</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DiscursivePage;
