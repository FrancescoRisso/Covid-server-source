/*

description:
	Page to show which data we have modified in the database
	
state:
	
props:
	
functions:
	- changes
	
imported into:
	- DiscursivePage
	
dependences:
	- 
	
*/

import React from "react";

class ModifiedData extends React.Component {
	constructor(props) {
		super(props);
	}

	changes = [
		{
			date: "2020-02-02",
			table: "Variazione",
			from: "+ 90000000",
			to: "+ 900"
		},
		{
			date: "2020-02-02",
			table: "Storico",
			from: 90000000,
			to: 900
		}
	];

	render() {
		return (
			<>
				<div className="row my-sm-5 mt-5 mb-2 mx-sm-3">
					<small className="mb-3">
						Questa pagina sarà completata solo nel momento della pubblicazione, perchè non mi sono segnato
						le modifiche che ho fatto, quindi le inserirò quando creerò il nuovo database sul server di
						distribuzione del sito. Anche eventuali {"{}"} indicano dati che ora non so, saranno sostituiti
						in produzione con dei dati veri. Inoltre i dati nella tabella per il momento sono "placeholder"
					</small>
					<p>Ci sono giornate in cui i dati forniti dalla protezione civile sono chiaramente sbagliati.</p>
					<p>
						Un esempio è il 24 giugno 2020, quando si registra un numero di decessi pari a {"{}"}, che è
						chiaramente impossibile. Visto che questo dato, però, non modifica eccessivamente il grafico,
						errori come questo sono stati lasciati per non alterare la veridicità dei dati
					</p>
					<p>
						Un altro esempio di errore è il {"{}"}, quando il valore {"{}"} vale {"{}"}, estremamente sopra
						il valore medio degli altri giorni. Questo comportava un enorme estensione della scala del
						grafico, e quindi i dati "giusti" venivano visti come una riga orizzontale. Questi sono gli
						errori che abbiamo corretto, e che sono elencati qui sotto.
					</p>
				</div>
				<div className="row my-sm-5 mt-5 mb-2 mx-sm-3">
					<table className="table table-striped table-fixed">
						<thead>
							<tr>
								<th scope="col" className="same">
									Data
								</th>
								<th scope="col" className="same">
									Tabella
								</th>
								<th scope="col" className="same">
									Valore originale
								</th>
								<th scope="col" className="same">
									Valore modificato
								</th>
							</tr>
						</thead>
						<tbody>
							{this.changes.map((c, index) => {
								return (
									<tr key={index}>
										<td>{c.date}</td>
										<td>{c.table}</td>
										<td>{c.from}</td>
										<td>{c.to}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}

export default ModifiedData;
