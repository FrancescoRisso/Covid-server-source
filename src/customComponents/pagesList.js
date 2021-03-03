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
	- Header
	
dependences:
	- GraphIcon, TableIcon, HomeIcon, ItalyIcon, PeopleIcon, What (static images)
	
*/

import GraphIcon from "../images/graphs.svg";
import TableIcon from "../images/table.svg";
import HomeIcon from "../images/home.svg";
import ItalyIcon from "../images/Italy.svg";
import RefsIcon from "../images/references.svg";
import PeopleIcon from "../images/people.svg";
import What from "../images/what.svg";

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
			title: "Chi siamo",
			image: PeopleIcon,
			link: "/aboutUs",
			code: "us",
			inMainPage: true
		},
		{
			title: "Cosa posso vedere?",
			image: What,
			link: "/what",
			code: "what",
			inMainPage: true
		},
		{
			title: "Fonti",
			image: RefsIcon,
			link: "/refs",
			code: "refs",
			inMainPage: true
		}
	];
};

export default get;
