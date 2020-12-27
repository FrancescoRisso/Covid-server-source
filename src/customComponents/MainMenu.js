import React from "react";
import { Link } from "react-router-dom";
import pagesList from "./pagesList";

class MainMenu extends React.Component {
	render() {
		return (
			<aside className="d-none col-sm-4 col-xl-2 col-12 mt-3 bg-light border red-outline" id="main-menu">
				<div className="list-group list-group-flush main-nav">
					<h3 className="py-2">Vai a...</h3>
					{pagesList(this.props.lastQuery, this.props.defaultQueryParams).map((choice) => {
						const defaultClasses = "list-group-item list-group-item-action d-flex";
						if (this.props.selectedMode == choice.code)
							return (
								<div
									className={defaultClasses + " selected-item hand"}
									key={choice.code}
									onClick={() => {
										document.getElementById("btn-toggle-main-menu").click();
									}}
								>
									<img src={choice.image} width={30} height={30} className="my-auto" />
									<p className="m-auto" key={choice.code}>
										{choice.title}
									</p>
								</div>
							);
						else
							return (
								<Link
									className={defaultClasses + " bg-light"}
									to={choice.link}
									key={choice.code}
									onClick={this.props.otherStuffToDo}
								>
									<img src={choice.image} width={30} height={30} className="my-auto" />
									<span className="m-auto">{choice.title}</span>
								</Link>
							);
					})}
				</div>
			</aside>
		);
	}
}

export default MainMenu;