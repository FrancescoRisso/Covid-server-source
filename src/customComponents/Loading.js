/*

description:
	The loading section, with the spinning spinner
	
state:
	
props:
	
functions:
	
imported into:
	- Page
	
dependences:
	
*/

import React from "react";

class Loading extends React.Component {
	render() {
		return (
			<div className="d-block col-12">
				<div className="d-flex justify-content-center mt-5">
					<div className="spinner-border" role="status">
						<span className="sr-only"></span>
					</div>
				</div>
			</div>
		);
	}
}

export default Loading;
