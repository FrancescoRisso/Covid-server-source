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

const getGraphs = async (from, to, list, table, perc, smooth, firstTry = true) => {
	let listStr = "";
	list.forEach((item, index) => {
		if (index == 1) listStr = item;
		else listStr = listStr + "," + item;
	});
	let response = await fetch(
		`/api/values?from=${from}&to=${to}&params=${list}&table=${table}&percentage=${perc}&smooth=${smooth}`
	);

	if (response.ok) {
		let data = await response.json();
		return data;
	} else {
		if (firstTry) {
			return getGraphs(from, to, list, table, perc, smooth, false).catch((e) => {
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
