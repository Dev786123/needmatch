import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        ai_score: null,
        ai_reason: "Gemini API key missing",
      });
    }

    const body = await req.json();

    const {
      needTitle = "",
      needBudget = "",
      needCity = "",
      providerSkill = "",
      providerBio = "",
      proposal = "",
      bid = "",
    } = body;

    const prompt = `
You are an AI match scoring assistant for a SaaS marketplace called NeedMatch.

Your task:
Analyze how well a provider matches a client's need.

Use these factors:
- Need title relevance
- Budget match
- City/location match
- Provider skill relevance
- Provider bio relevance
- Proposal quality
- Bid suitability

Need:
- Title: ${needTitle}
- Budget: ${needBudget}
- City: ${needCity}

Provider:
- Skill: ${providerSkill}
- Bio: ${providerBio}
- Proposal: ${proposal}
- Bid: ${bid}

Return ONLY valid JSON.
Do not use markdown.
Do not add explanation outside JSON.

Format:
{
  "score": 0,
  "reason": "short reason under 25 words"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        ai_score: null,
        ai_reason: "AI score not available",
      });
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: {
      score: number | null;
      reason: string;
    };

    try {
      parsed = JSON.parse(cleanText);
    } catch {
      parsed = {
        score: null,
        reason: "AI score not available",
      };
    }

    const score =
      typeof parsed.score === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.score)))
        : null;

    return NextResponse.json({
      success: true,
      ai_score: score,
      ai_reason: parsed.reason || "AI score not available",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      ai_score: null,
      ai_reason: "AI failed",
    });
  }
}
