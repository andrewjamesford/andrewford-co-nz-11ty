import fetch from "node-fetch";

exports.handler = async function (event, context) {
	try {
		const apiKey = process.env.YOUTUBE_API_KEY;
		const channelId = process.env.YOUTUBE_CHANNEL_ID;

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ` + JSON.stringify(response.status + ' ' + response.statusText));
		}
		const data = await response.json();
		const lastUploadData = data.items;

		return {
			statusCode: 200,
			body: JSON.stringify(lastUploadData),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error_description: error.message }),
		};
	}
};
