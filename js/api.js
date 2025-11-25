import { Config } from './config.js';

export const API = {
  /**
   * Calls the Gemini API to get trending topics.
   */
  async findTrendingTopics(keywords) {
    const apiKey = Config.getGeminiKey();
    if (!apiKey) throw new Error("Gemini API Key is missing.");

    const prompt = `Act as a LinkedIn social media analyst. Based on current trends in "${keywords}", suggest 5-7 highly engaging and trending topics that would likely get high impressions, likes, and comments on LinkedIn. Focus on topics that are broadly relevant to a professional audience. Provide only the topic names, one per line, without any additional explanation or numbering.`;

    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message);

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text
        .split('\n')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0);
    }
    throw new Error('No topics found in response.');
  },

  /**
   * Calls Puter.js to generate an image.
   */
  async generateImageWithPuter(prompt) {
    try {
      // puter.ai.txt2img returns an Image object (HTMLImageElement)
      const imageElement = await puter.ai.txt2img(prompt);
      return imageElement.src;
    } catch (error) {
      console.error('Puter.js image generation error:', error);
      throw new Error('Failed to generate image with Puter.js.');
    }
  },

  /**
   * Calls the Gemini API to get optimal posting times.
   */
  async getOptimalPostingTimes(postContent, topic) {
    const apiKey = Config.getGeminiKey();
    if (!apiKey) return 'API Key missing, cannot fetch times.';

    const prompt = `Based on the following LinkedIn post content and topic, what is the single best day and time (e.g., "Tuesday at 10:00 AM IST") for posting to maximize engagement? Provide ONLY the day and time in IST, nothing else.
        
        Post Content: "${postContent.substring(0, 500)}..."
        Topic: "${topic}"`;

    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion available.';
    } catch (error) {
      console.error('Error fetching times:', error);
      return 'Failed to fetch times.';
    }
  },

  /**
   * Calls the Gemini API to generate a LinkedIn post.
   */
  async generatePostText(topic, userStyle, postIndex, totalPosts) {
    const apiKey = Config.getGeminiKey();
    if (!apiKey) throw new Error("Gemini API Key is missing.");

    let textPrompt = `You are an expert LinkedIn content creator. Your goal is to write a highly engaging and catchy LinkedIn post on the topic: "${topic}". The post should be approximately 20-30 lines long, aiming to maximize impressions, likes, and comments, and encourage followers.

        Crucially, do NOT include any introductory phrases like "Here's your LinkedIn post draft," "Draft post," or similar. Start directly with the content of the post.
        Do NOT use Markdown bolding (**) or list bullets (*) anywhere in the post. Do NOT try to bold using (*) in the start and end of a word. Do NOT use the word Hashtag before hastag symbol. Use emojis or simple line breaks for visual separation if needed.`;

    if (userStyle) {
      textPrompt += ` Adopt a writing style and tone similar to the following examples of my past posts:\n\n---\n${userStyle}\n---\n\nEnsure the new post reflects this style.`;
    } else {
      textPrompt += ` Use a professional, insightful, and slightly conversational tone. Ensure the post encourages interaction and includes relevant hashtags.`;
    }

    textPrompt += ` Make sure the post is comprehensive, uses emojis where appropriate, and has a clear call to action or question to spark discussion. This is post number ${postIndex} out of ${totalPosts}. Make it distinct from other generated posts if multiple are requested.`;

    const payload = { contents: [{ role: "user", parts: [{ text: textPrompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message);

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    }
    throw new Error('Failed to generate post text.');
  }
};
