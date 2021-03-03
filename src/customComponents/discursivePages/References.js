/*

description:
	The page containing all the references used in our website
	
state:
	
props:
	
functions:
	
imported into:
	- DiscursivePage
	
dependences:
	- Header
	- NavMenu
	- ImgProtezioneCivile, ImgRtFormula, ImgCode (static images)
	- Link (from react-router-dom)
	
*/

import React from "react";
import ImgProtezioneCivile from "../../images/protezioneCivile.svg";
import ImgRtFormula from "../../images/rtFormula.svg";
import ImgCode from "../../images/code.svg";
import { Link } from "react-router-dom";

class References extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				{/* PROTEZIONE CIVILE */}
				<div className="row my-sm-5 mt-5 mb-2 mx-sm-3">
					<a className="d-none d-sm-block col-4 col-lg-2 my-auto" href="http://www.protezionecivile.gov.it/">
						<img src={ImgProtezioneCivile} width="100%"></img>
					</a>
					<a className="d-sm-none col-12 my-auto" href="http://www.protezionecivile.gov.it/">
						<img src={ImgProtezioneCivile} width="100" className="mb-3"></img>
					</a>
					<span className="col-12 col-sm-8 col-lg-10 my-auto">
						<p>
							I dati della pandemia sono prelevati giornalmente (verso le ore 19.00) dal{" "}
							<a href="https://github.com/pcm-dpc/COVID-19/tree/master/dati-json">
								repository github della protezione civile
							</a>
							.
						</p>
						<p>
							Sono poi elaborati da noi per poter mostrare alcuni dati non direttamente forniti dalla
							Protezione Civile, ma calcolabili a partire da quelli (come per esempio i vari confronti).
						</p>
						<p>
							Alcuni giorni i dati erano palesemente errati. Se questo errore rendeva il grafico
							insensato, abbiamo deciso di modificarli per migliorare la visione del grafico.{" "}
							<Link to="/modifiedData">Qui</Link> c'è l'elenco di tutti i dati che abbiamo modificato
						</p>
					</span>
				</div>
				<hr />
				{/* RT E DISTRIBUZIONE GAMMA */}
				<div className="row my-sm-5 mt-5 mb-2 mx-sm-3">
					<a className="d-sm-none col-12 my-auto" href="https://it.wikipedia.org/wiki/Distribuzione_Gamma">
						<img src={ImgRtFormula} width="200" className="mb-3"></img>
					</a>
					<span className="col-12 col-sm-8 col-lg-10 my-auto">
						<p>
							L'indice Rt è calcolato usando il codice (in linguaggio python) reperibile a{" "}
							<a href="https://github.com/tomorrowdata/COVID-19/blob/main/notebooks/Rt_on_italian_national_data.ipynb">
								questo sito
							</a>
							, che segue la formula qui riportata.
						</p>
						<p>
							<i>
								I<sub>t</sub>
							</i>{" "}
							e{" "}
							<i>
								I<sub>t-s</sub>
							</i>{" "}
							sono rispettivamente il numero di nuovi positivi ai giorni <i>t</i> e <i>t-s</i>
							<br />
							<i>
								w<sub>s</sub>
							</i>{" "}
							è una distribuzione gamma, con {String.fromCharCode(945)} = 1,87 e{" "}
							{String.fromCharCode(946)} = 0,28.
						</p>
					</span>
					<a
						className="d-none d-sm-block col-4 col-lg-2 my-auto"
						href="https://it.wikipedia.org/wiki/Distribuzione_Gamma"
					>
						<img src={ImgRtFormula} width="100%"></img>
					</a>
				</div>
				<hr />
				{/* PROTEZIONE CIVILE */}
				<div className="row my-sm-5 mt-5 mb-2 mx-sm-3">
					<a className="d-none d-sm-block col-4 col-lg-2 my-auto" href="http://www.protezionecivile.gov.it/">
						<img src={ImgCode} width="100%"></img>
					</a>
					<a className="d-sm-none col-12 my-auto" href="http://www.protezionecivile.gov.it/">
						<img src={ImgCode} width="100" className="mb-3"></img>
					</a>
					<span className="col-12 col-sm-8 col-lg-10 my-auto">
						<p>
							Questo sito è stato creato usando la libreria React di javascript, sviluppata da Facebook.
						</p>
						<p>
							Il codice sorgente del sito (javascript), insieme al codice (python) del server che fornisce
							i dati, è pubblicamente accessibile su github:{" "}
						</p>
						<p>
							<a href="https://github.com/pcm-dpc/COVID-19/tree/master/dati-json">Qui</a> si trova il
							codice vero e proprio installato sul server
							<br />
							(il server è normale, mentre il codice della pagina web è compresso da React).
							<br />
							<a href="https://github.com/pcm-dpc/COVID-19/tree/master/dati-json">Qui</a> invece c'è il
							progetto React originale, con la parte di pagina web più leggibile.
						</p>
					</span>
				</div>
				<hr />
			</>
		);
	}
}

export default References;