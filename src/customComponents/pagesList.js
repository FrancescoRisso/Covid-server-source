/*

description:
	All the pages in the website, with the respective icons and links
	
state:
	
props:
	
functions:
	- get(lastQuery, defaultQueryParams): returns the list
	
imported into:
	- NavMenu
	- FirstPage
	
dependences:
	- GraphIcon, TableIcon, HomeIcon, ItalyIcon, Null (static images)
	
*/

import GraphIcon from "../images/graphs.svg";
import TableIcon from "../images/table.svg";
import HomeIcon from "../images/home.svg";
import ItalyIcon from "../images/Italy.svg";
import Null from "../images/blank.svg";

const get = (lastQuery, defaultQueryParams) => {
	return [
		{
			title: "Pagina principale",
			image: HomeIcon,
			link: `/`,
			code: "initial-page",
			inMainPage: false
		},
		{
			title: "Grafici",
			image: GraphIcon,
			link: `/graph${lastQuery == "none" ? defaultQueryParams : lastQuery}`,
			code: "graph",
			inMainPage: true
		},
		{
			title: "Mappa",
			image: ItalyIcon,
			link: `/map${lastQuery == "none" ? defaultQueryParams : lastQuery}`,
			code: "map",
			inMainPage: true
		},
		{
			title: "Database (per utenti esperti)",
			image: TableIcon,
			link: "/raw",
			code: "raw",
			inMainPage: true
		},
		{
			title: "Chi siamo (toDo)",
			image: Null,
			link: "/",
			code: "us",
			inMainPage: true
		},
		{
			title: "Cosa posso vedere? (toDo)",
			image: Null,
			link: "/",
			code: "what",
			inMainPage: true
		},
		{
			title: "Fonti (toDo)",
			image: Null,
			link: "/",
			code: "info",
			inMainPage: true
		}
	];
};

export default get;
