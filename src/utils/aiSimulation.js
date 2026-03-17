/**
 * AI response system for the murder mystery interrogation.
 * Always calls the Gemini API for every player question.
 * Falls back to a single neutral message only if the API key is missing
 * or the network request fails.
 */

/**
 * Strip any trailing incomplete sentence.
 * If the text ends without sentence-terminating punctuation (.!?),
 * cut everything after the last complete sentence.
 */
const sanitizeResponse = (text) => {
  const trimmed = text.trim();
  if (/[.!?]$/.test(trimmed)) return trimmed;
  const lastPunct = Math.max(
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?')
  );
  if (lastPunct !== -1) return trimmed.slice(0, lastPunct + 1);
  return trimmed;
};

export const generateAIResponse = async (input, suspect, isMurderer, victimName, suspectRelationship = 'Acquaintance') => {
  console.log(`[AI] generateAIResponse called — suspect: "${suspect.name}", isMurderer: ${isMurderer}, victim: "${victimName}", relationship: "${suspectRelationship}"`);
  console.log(`[AI] Player input: "${input}"`);

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    console.warn('[AI] No OpenRouter API key found in environment variables. Please set VITE_OPENROUTER_API_KEY in your .env file.');
    console.warn('[AI] Using fallback text (no API key).');
    return "I'm afraid I can't speak right now. Please ensure the AI service is configured.";
  }

  const systemPrompt = `You are playing the role of ${suspect.name} in a murder mystery game.
You are a suspect in the murder of ${victimName}.
Your relationship to the victim: ${suspectRelationship}
Your personality/background: ${suspect.description}
Your motive: ${suspect.motive || 'none'}
Your alibi: ${suspect.alibi || 'none'}
Are you the murderer? ${
    isMurderer
      ? 'YES. You must subtly hide this fact, but act defensive if pressed.'
      : 'NO. You are innocent.'
  }

IMPORTANT RULES:
- The victim (${victimName}) is NOT a suspect. You are one of the living suspects being interrogated.
- Always respond in English.
- Write exactly 2 to 3 complete sentences. Never write fewer than 2 or more than 3 sentences.
- Every sentence must be grammatically complete and end with a period, exclamation mark, or question mark.
- Do not cut off mid-sentence.
- Stay strictly in character as a ${suspectRelationship}.

Respond naturally to the detective's question. Stay strictly in character. Do not break the fourth wall.

Detective asks: "${input}"`;

  try {
    console.log('[AI] Sending request to OpenRouter API...');
    // Non-streaming chat completion — await the full response before returning.
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Murder Mystery',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [{ role: 'user', content: systemPrompt }],
          temperature: 0.8,
          max_tokens: 300,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const raw = data.choices[0].message.content;
        console.log('[AI] Raw response received:', raw);
        const sanitized = sanitizeResponse(raw);
        if (sanitized !== raw.trim()) {
          console.log('[AI] Sanitized response (incomplete sentence trimmed):', sanitized);
        }
        return sanitized;
      }
      console.error('[AI] OpenRouter API returned no choices:', data);
    } else {
      const errBody = await response.text();
      console.error(`[AI] OpenRouter API Error — status: ${response.status}`, errBody);
    }
  } catch (error) {
    console.error('[AI] Network or fetch error calling OpenRouter API:', error);
  }

  // Only reached when the API call fails — single minimal fallback.
  console.warn('[AI] Using fallback text (API call failed or returned no result).');
  return "I have nothing to say about that right now. Try asking me something else.";
};
