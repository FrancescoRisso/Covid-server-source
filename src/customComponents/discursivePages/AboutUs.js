/*

description:
	The page to explain who we are
	
state:
	
props:
	
functions:
	- helpers	

imported into:
	- DiscursivePage
	
dependences:
	
*/

import React from "react";

class AboutUs extends React.Component {
	constructor(props) {
		super(props);
	}

	helpers = {
		"Carlo Caiaffa": "che ci ha fornito il suo fondamentale aiuto nella coordinazione e indirizzamento del sito",
		"Giulia Masuello":
			"studentessa presso IED Milano, che ci ha guidati nella gestione organizzativa ed estetica del sito",
		"Letizia Repetto":
			"studentessa al primo anno di ing. Edile al Politecnico di Torino, che ha sopperito alla grave carenza di gusto estetico che abbiamo io e Anna",
		"Alessandro Provera":
			'iscritto al primo anno di ing. Gestionale al Politecnico di Torino, che ci ha fornito nuove idee per migliorare il sito, ed è stato uno degli importantissimi "beta tester"',
		"Riccardo Rosin":
			"studente del primo anno di ing. Informatica al Politecnico di Torino, beta tester e grande fonte di idee e supporto morale",
		"Andrea Riccardi":
			"iscritto al primo anno di ing. Fisica al Politecnico di Torino, altro grande suggeritore di idee e importante beta tester"
	};

	render() {
		return (
			<div>
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>CHI SIAMO?</b>
				</p>
				<p>
					Ciao! Piacere di conoscerti, sono Francesco Risso. Io e la mia collega Anna Roma siamo gli ideatori
					e creatori di questo sito.
				</p>
				<p>
					Io sono uno studente del primo anno di ingegneria informatica al Politecnico di Torino. Nel tempo
					libero la mia passione è programmare, ma sono sempre a corto di idee: per fortuna esistono un sacco
					di persone che invece di idee ne hanno (a volte fin troppe).
				</p>
				<p>
					Con l'inizio delle lezioni universitarie ho conosciuto una di queste persone: Anna Roma, una mia
					compagna di corso. Anche lei come me è una studentessa al primo anno del Politecnico di Torino, e
					frequenta Matematica per l'ingegneria. Essendo una persona "mente matematica", durante il primo
					lockdown era alla disperata ricerca di qualcosa che la aiutasse a visualizzare dei grafici con
					l'andamento della pandemia, in maniera trasparente e diretta. La ricerca non ebbe successo,
					purtroppo o per fortuna.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>DA DOVE È NATA L'IDEA?</b>
				</p>
				<p>
					Quando ci siamo conosciuti un po' (purtroppo solo online), Anna mi ha messo questa pulce
					nell'orecchio. Io ho accettato molto volentieri, perché capivo in pieno il suo desiderio di ricerca
					della verità. Eravamo entrambi stanchi di sentire dati forniti dai telegiornali senza contesto,
					correlazione o, peggio, trasparenza.
				</p>
				<p>
					Con questo progetto abbiamo imparato l’importanza e la necessità della matematica non solo nella
					nostra vita, ma anche quando si vuole studiare l’andamento di una pandemia. Un numero da solo
					significa poco, mentre tanti numeri messi insieme, se li si sa leggere, possono trasmettere molte
					più informazioni accurate.
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>LA CREAZIONE DEL SITO</b>
				</p>
				<p>Ci siamo quindi messi a cercare i valori prima, per rappresentarli poi su questo sito.</p>
				<p>
					Non è stato un compito facile, è costato parecchi mesi di lavoro e di continuo imparare nuove cose:
					imparare a crare e gestire un sito, capire quali scelte potevano portare a quali miglioramenti, dove
					trovare le formule per i calcoli che ci servivano...
				</p>
				<p>
					In conclusione di questo progetto, mi sento di dire che è stato un bel lavoro di squadra: Anna è
					stata la mente del sito, mentre io mi definisco "la sua tastiera".
				</p>
				<hr />
				<p className="mt-4 big ml-sm-5 ml-3">
					<b>CHI CI HA AIUTATI</b>
				</p>
				<p>
					Per quanto possa sembrare strano ad una persona estranea alla creazione di siti web, il processo per
					portare alla luce un sito è estremamente lungo e complesso, e richiede la partecipazione di molte
					persone, esperte in vari campi.
				</p>
				<p>
					Siamo entrambi infinitamente grati per il grande aiuto che abbiamo ricevuto. È stata un’incredibile
					esperienza di collaborazione e coordinazione: dal proporre idee, al testare le funzionalità e
					(soprattutto) trovare i problemi, dallo spiegarci che scelte dovevamo prendere, al semplice (ma
					quantomai necessario) supporto morale.
				</p>
				<p>Vorremmo perciò ringraziare tutte le persone che ci hanno dato una mano in questo progetto:</p>
				<ul>
					{Object.keys(this.helpers)
						.sort()
						.map((name) => {
							return (
								<li className="mt-2" key={name}>
									{name}, {this.helpers[name]}.
								</li>
							);
						})}
				</ul>
			</div>
		);
	}
}

export default AboutUs;
