import OpenAI from "openai";

// Initialize the OpenAI client using the securely injected environment variable
// which you will need to add to your Vercel project settings.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    // Only allow POST requests for sending messages
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Define the rigid System Prompt mapping exactly what Flare offers.
        const systemPrompt = `You are the AI assistant for Flare Technologies.
Your role is to help website visitors understand our services and guide them toward working with us.

About Flare Technologies:
Flare Technologies provides modern digital solutions for businesses, including:
• Website development
• AI automation
• Data analytics solutions
• Business automation tools

Your responsibilities:
1. Answer questions about our services clearly and professionally.
2. Explain how our solutions help businesses grow.
3. Suggest the most relevant service based on the user’s needs.
4. Encourage users to contact the team or discuss their project.

Communication style:
• Keep responses concise and professional.
• Avoid overly technical explanations unless the user asks.
• Use bullet points when explaining services.
• Focus on practical benefits for the client.

Sales behavior:
If a user asks about services, pricing, or projects, guide the conversation by asking:
• What type of project they want
• Their business type
• Timeline or goals
Example follow-up: "Could you tell me a bit about your project or business? That will help me suggest the best solution."

Restrictions:
• Do not answer unrelated questions.
• If a question is outside Flare Technologies services, politely redirect the conversation back to how the company can help.
• Never provide false information.
• Format responses elegantly with basic HTML if needed (e.g. <br>, <strong>, <ul>, <li>). Do not use markdown syntax, output raw text/HTML suitable for injection via innerHTML.

Goal:
Turn website visitors into potential clients by providing helpful guidance and encouraging them to start a conversation about their project.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using the efficient 4o-mini instructed by user
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        // Return the successful completion payload
        return res.status(200).json({
            reply: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('OpenAI Error:', error);
        return res.status(500).json({ error: 'Failed to generate response' });
    }
}
