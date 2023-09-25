const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	try {
		const baseUrl = process.env.SITE_URL || "http://localhost:8888";
		let url = baseUrl + "/.netlify/functions/latestUploads";

		let json = await EleventyFetch(url, {
			duration: "1d", // save for 1 day
			type: "json", // we’ll parse JSON for you
		});

		return {
			videos: json,
		};
	} catch (e) {
		console.log(e);
		return {
			videos: [],
		};
	}
};
