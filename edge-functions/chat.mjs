export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { question } = await request.json();
  if (!question) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Question is required" }),
    };
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch("http://localhost:8888/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        for await (const chunk of response) {
          const data = `${JSON.stringify(chunk)}\n`;
          controller.enqueue(new TextEncoder().encode(data));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
