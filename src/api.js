"use strict";

const getRawData = async (firstTry = true) => {
	let response = await fetch("/api/raw");

	if (response.ok) {
		let data = await response.json();
		return data;
	} else {
		if (firstTry) {
			return getRawData(false).catch((e) => {
				throw e;
			});
		} else throw "Error";
	}
};

const getGraphs = async (from, to, param, table, perc, smooth, firstTry = true) => {
	let response = await fetch(
		`/api/values?from=${from}&to=${to}&param=${param}&table=${table}&percentage=${perc}&smooth=${smooth}`
	);
		
	if (response.ok) {
		let data = await response.json();
		return data;
	} else {
		if (firstTry) {
			return getGraphs(from, to, param, table, perc, smooth, false).catch((e) => {
				throw e;
			});
		} else throw "Error";
	}
};

const getFieldsList = async (firstTry = true) => {
	let response = await fetch(`/api/fieldlist`);

	if (response.ok) {
		let data = await response.json();
		return data;
	} else {
		if (firstTry) {
			return getFieldsList(false).catch((e) => {
				throw e;
			});
		} else throw "Error";
	}
};

export { getRawData, getGraphs, getFieldsList };
