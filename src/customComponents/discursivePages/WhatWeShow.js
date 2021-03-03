/*

description:
	The static page describing all the choices you can make about the graphs on the website
	
state:
	
props:
	- graphsList: the list of all graphs served by the server
	
functions:
	
imported into:
	- DiscursivePage
	
dependences:
	
*/

import React from "react";

class WhatWeShow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="left">
				<p className="mt-4 ml-sm-5 ml-3">
					<b className="big">“Se torturi i numeri abbastanza a lungo, confesseranno qualsiasi cosa.”</b>
					<br />
					<i className="ml-sm-5 ml-3">~Gregg EasterBrook</i>
				</p>
				<p>
					Probabilmente navigando in questo sito hai trovato un sacco di opzioni, ognuna delle quali ti mostra
					dei grafici diversi.
					<br />
					Se ti stai chiedendo cosa siano tutte queste scelte, e perchè ci sono, sei nel posto giusto. Ognuna
					di queste porta a scoprire delle informazioni diverse, pur sempre partendo dagli stessi dati.
					Vediamo insieme il significato di ogni scelta.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>Valori giornalieri o variazione giornaliera?</b>
				</p>
				<p>
					Solitamente siamo abituati a vedere direttamente i valori, e analizzare la variazione dei dati
					semplicemente dal grafico.
					<br />
					Tuttavia, in certi casi potrebbe essere comodo visualizzare i dati in variazione, perchè aiuta a
					notare con facilità se il valore è migliorato o peggiorato, ossia se il valore è sopra o sotto lo
					zero, rappresentato con una linea rossa.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>Dato numerico o percentuale?</b>
				</p>
				<p>
					Quando sentiamo i numeri al telegiornale, sono sempre espressi come numeri puri ("Oggi 336 decessi,
					2074 persone in terapia intensiva"). Questo è interessante per avere un'idea del numero in sè, ma è
					poco utile nella visione d’insieme. Confrontare tra regioni un dato come numero puro non ci aiuta a
					capire la gravità della situazione nei luoghi d’indagine. Per esempio, un atteggiamento simile
					sarebbe confrontare lo stesso dato tra USA e S. Marino: è ovvio che il dato americano sarà
					enormemente maggiore, perché anche la popolazione lo è.
					<br />È qui che diventa interessante la visualizzazione percentuale: il dato fornito risulta
					calcolato in proporzione alla popolazione locale e per questo motivo risulta più adatto a
					confrontare gli stessi dati di territori con popolazioni anche molto diverse. Inoltre, questo metodo
					ci torna utile per studiare l'andamento di una specifica regione rispetto alle altre, oppure
					direttamente rispetto all'Italia, cosa impossibile se si visualizzano i dati numerici puri.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>Grafico preciso o smussato?</b>
				</p>
				<p>
					In base a cosa preferisci visualizzare, puoi scegliere un grafico preciso (nel caso in cui desideri
					avere i dati precisi giorno per giorno), oppure un grafico smussato (se sei interessato a vedere
					qualitativamente l'andamento, senza preoccuparti che i valori siano precisi nel dettaglio).
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>Scala lineare o logaritmica?</b>
				</p>
				<p>
					La scala lineare di solito è quella più semplice e immediata da capire, infatti è quella impostata
					di default.
					<br />
					Tuttavia, abbiamo deciso di inserire anche questa opzione per gli utenti più esperti in materia. La
					scala logaritmica, infatti, è spesso usata dai matematici perché aiuta a focalizzarsi sui dati più
					piccoli, che spesso sono più interessanti.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>E quali grafici posso vedere?</b>
				</p>
				<p>
					Diciamo che hai l'imbarazzo della scelta. Qui ti propongo un elenco di tutti i grafici che puoi
					vedere, ma il consiglio è di esplorare il sito e conoscerli meglio da lì.
				</p>
				<ul>
					{this.props.graphsList
						.sort((a, b) => {
							if (a.name > b.name) return 1;
							return -1;
						})
						.map((graph) => {
							console.log(graph);
							return (
								<li>
									<b>{graph.name}</b>
									<p>
										<small>{graph.description}</small>
									</p>
								</li>
							);
						})}
				</ul>
			</div>
		);
	}
}

export default WhatWeShow;
