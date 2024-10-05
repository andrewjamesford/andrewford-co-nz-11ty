const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async () => {
	try {
		const baseUrl = process.env.SITE_URL || "http://localhost:8888";
		const url = `${baseUrl}/.netlify/functions/lastplayed`;

		const json = await EleventyFetch(url, {
			duration: "1h", // save for 1 hour
			type: "json", // we’ll parse JSON for you,
			directory: "/tmp/.cache/", // Netlify Functions
		});

		return {
			music: json,
		};
	} catch (e) {
		console.log(e);
		return {
			music: [],
		};
	}
};
