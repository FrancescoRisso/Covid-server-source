"use strict";

const getRawData = async () => {
	let response = await fetch("/api/raw");
	let data = await response.json();

	if (response.ok) {
		return data;
	} else {
		throw data;
	}
};

const getGraphs = async (from, to, list, table, perc) => {
	let listStr = "";
	list.forEach((item, index) => {
		if (index == 1) listStr = item;
		else listStr = listStr + "," + item;
	});
	let response = await fetch(`/api/values?from=${from}&to=${to}&params=${list}&table=${table}&percentage=${perc}`);
	let data = await response.json();

	if (response.ok) {
		return data;
	} else {
		throw data;
	}
};

const getFieldsList = async () => {
	let response = await fetch(`/api/fieldlist`);
	let data = await response.json();

	if (response.ok) {
		return data;
	} else {
		throw data;
	}
};

export { getRawData, getGraphs, getFieldsList };
