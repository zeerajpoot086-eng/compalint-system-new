import { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

export interface AIAnalysisResult {
  suggestedCategory: 'Electrician' | 'Plumber' | 'AC Repair' | 'Internet/WiFi' | 'Computer/Laptop' | 'Appliance Repair' | 'Other';
  suggestedPriority: 'Low' | 'Medium' | 'High' | 'Urgent';
  problemSummary: string;
  suggestedNextStep: string;
  confidenceScore: number;
  tags: string[];
  isAiGenerated: boolean;
}

// Rule-Based Fallback Engine for offline / zero-key mode
function analyzeRuleBased(text: string): AIAnalysisResult {
  const lower = text.toLowerCase();
  
  let category: AIAnalysisResult['suggestedCategory'] = 'Other';
  let priority: AIAnalysisResult['suggestedPriority'] = 'Medium';
  let problemSummary = 'Maintenance & repair inquiry';
  let suggestedNextStep = 'General technical inspection scheduled.';
  const tags: string[] = [];

  // Urgent detection keywords
  const isEmergency = /spark|smoke|fire|flood|gushing|shock|burst|gas|explosion|burning|hazard/i.test(lower);
  const isHigh = /leak|broken|stopped working|tripping|no internet|won't start|freezing|overheating|blank screen/i.test(lower);
  
  if (isEmergency) {
    priority = 'Urgent';
  } else if (isHigh) {
    priority = 'High';
  } else if (/slow|noise|cleaning|routine|flicker|loose/i.test(lower)) {
    priority = 'Low';
  }

  // Category & Diagnostic Rules
  if (/electric|wire|breaker|fuse|spark|switch|socket|power|shock|blackout|mcb/i.test(lower)) {
    category = 'Electrician';
    problemSummary = 'Electrical system wiring or breaker issue detected';
    suggestedNextStep = isEmergency 
      ? 'Disconnect main breaker switch immediately and avoid touching exposed wires.'
      : 'Keep circuit turned off until an electrician verifies line voltage and continuity.';
    tags.push('electrical', 'voltage', 'circuit');
  } else if (/pipe|leak|drain|water|sink|toilet|tap|faucet|clog|sewer|plumb/i.test(lower)) {
    category = 'Plumber';
    problemSummary = 'Plumbing fixture leakage or drainage blockage';
    suggestedNextStep = isEmergency 
      ? 'Shut off main water inlet valve and place catchment buckets under the leak.'
      : 'Do not use chemical drain openers; prepare area for pipe inspection and joint resealing.';
    tags.push('plumbing', 'water-line', 'drainage');
  } else if (/ac|air condition|cool|chiller|hvac|compressor|freon|refrigerant|filter|blower/i.test(lower)) {
    category = 'AC Repair';
    problemSummary = 'HVAC cooling cycle or airflow compressor malfunction';
    suggestedNextStep = 'Turn off AC unit to prevent compressor coil freezing. Clean accessible air filters.';
    tags.push('hvac', 'cooling', 'compressor');
  } else if (/wifi|wi-fi|internet|router|modem|lan|ethernet|network|signal|disconnect/i.test(lower)) {
    category = 'Internet/WiFi';
    problemSummary = 'Broadband connectivity or local router configuration outage';
    suggestedNextStep = 'Power cycle modem and router for 30 seconds. Verify fiber link indicator LEDs.';
    tags.push('network', 'wifi', 'broadband');
  } else if (/laptop|computer|pc|windows|mac|screen|boot|crash|ram|keyboard|virus/i.test(lower)) {
    category = 'Computer/Laptop';
    problemSummary = 'Computer hardware fault or operating system crash';
    suggestedNextStep = 'Disconnect peripheral accessories. Ensure device is plugged into stable surge protector.';
    tags.push('computing', 'hardware', 'os');
  } else if (/fridge|refrigerator|washing machine|dryer|oven|microwave|dishwasher|appliance/i.test(lower)) {
    category = 'Appliance Repair';
    problemSummary = 'Household mechanical/electrical appliance failure';
    suggestedNextStep = 'Unplug appliance from wall socket and check for foreign object obstruction.';
    tags.push('appliance', 'motor', 'power');
  }

  return {
    suggestedCategory: category,
    suggestedPriority: priority,
    problemSummary,
    suggestedNextStep,
    confidenceScore: 0.88,
    tags: tags.length > 0 ? tags : ['maintenance', 'inspection'],
    isAiGenerated: false
  };
}

export const analyzeComplaintAI = async (req: Request, res: Response): Promise<void> => {
  const { description } = req.body;

  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    res.status(400).json({
      success: false,
      message: 'Please provide a detailed problem description (at least 5 characters).'
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key is configured or is dummy placeholder, execute fallback
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const fallbackResult = analyzeRuleBased(description);
    res.json({
      success: true,
      analysis: fallbackResult,
      source: 'rule-based-engine'
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Analyze this customer technical repair/service complaint:
"${description}"

Classify into:
- Category: strictly one of ["Electrician", "Plumber", "AC Repair", "Internet/WiFi", "Computer/Laptop", "Appliance Repair", "Other"]
- Priority: strictly one of ["Low", "Medium", "High", "Urgent"] (Use Urgent if safety hazard like sparks, burning smell, major flooding, gas, or electrical shock)
- Problem Summary: concise professional 1-sentence technical diagnosis (under 15 words)
- Suggested Next Step: actionable safety or preparation guidance for the customer before the technician arrives
- Confidence Score: number between 0.80 and 1.00
- Tags: 2-4 lowercase keyword tags`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCategory: {
              type: Type.STRING,
              description: 'The most accurate service category'
            },
            suggestedPriority: {
              type: Type.STRING,
              description: 'Priority level: Low, Medium, High, or Urgent'
            },
            problemSummary: {
              type: Type.STRING,
              description: 'Short technical problem summary'
            },
            suggestedNextStep: {
              type: Type.STRING,
              description: 'Immediate advice/safety tip for the customer'
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Confidence score'
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key categorization tags'
            }
          },
          required: ['suggestedCategory', 'suggestedPriority', 'problemSummary', 'suggestedNextStep']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    // Validate and sanitize response fields
    const validCategories = ['Electrician', 'Plumber', 'AC Repair', 'Internet/WiFi', 'Computer/Laptop', 'Appliance Repair', 'Other'];
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];

    const category = validCategories.includes(parsed.suggestedCategory) ? parsed.suggestedCategory : 'Other';
    const priority = validPriorities.includes(parsed.suggestedPriority) ? parsed.suggestedPriority : 'Medium';

    const result: AIAnalysisResult = {
      suggestedCategory: category as AIAnalysisResult['suggestedCategory'],
      suggestedPriority: priority as AIAnalysisResult['suggestedPriority'],
      problemSummary: parsed.problemSummary || 'Issue analyzed by FixMate AI',
      suggestedNextStep: parsed.suggestedNextStep || 'Technician will inspect on arrival.',
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.95,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['service-request'],
      isAiGenerated: true
    };

    res.json({
      success: true,
      analysis: result,
      source: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.warn('Gemini API call failed or rate limited, falling back to rule engine:', error.message);
    const fallbackResult = analyzeRuleBased(description);
    res.json({
      success: true,
      analysis: fallbackResult,
      source: 'rule-based-fallback'
    });
  }
};
