import GraphIcon from "../images/graphs2.svg";
import TableIcon from "../images/table1.svg";
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
			link: `/graph/${lastQuery == "none" ? defaultQueryParams : lastQuery}`,
			code: "graph",
			inMainPage: true
		},
		{
			title: "Mappa",
			image: ItalyIcon,
			link: `/map/${lastQuery == "none" ? defaultQueryParams : lastQuery}`,
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
