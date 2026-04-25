import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      needTitle,
      needBudget,
      needCity,
      providerSkill,
      providerBio,
      proposal,
      bid,
    } = body;

    const prompt = `
You are an AI that matches service providers with client needs.

Analyze the following:

Need:
- Title: ${needTitle}
- Budget: ${needBudget}
- City: ${needCity}

Provider:
- Skill: ${providerSkill}
- Bio: ${providerBio}
- Proposal: ${proposal}
- Bid: ${bid}

Return JSON only:
{
  "score": number (0-100),
  "reason": "short explanation"
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        score: null,
        reason: "AI score not available",
      };
    }

    return NextResponse.json({
      success: true,
      ai_score: parsed.score,
      ai_reason: parsed.reason,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      ai_score: null,
      ai_reason: "AI failed",
    });
  }
}
