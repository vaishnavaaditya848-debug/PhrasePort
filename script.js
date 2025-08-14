// Minimal client with offline fallback + backend support
const el = (id) => document.getElementById(id);

const templates = {
  notice: ({topic, details, tone, words, language, formatting}) => `
${formatting === 'markdown' ? `# NOTICE\n` : 'NOTICE\n'}
Topic: ${topic}
${details ? `Details: ${details}\n` : ''}
Tone: ${tone} | Language: ${language} | ~${words} words

${lipsum(language, words, 'notice')}
`.trim(),

  email: ({topic, details, tone, words, language, formatting}) => `
${formatting === 'markdown' ? `# Email\n` : ''}
Subject: ${topic}

Dear [Recipient],

${lipsum(language, Math.max(80, words - 40), 'email')}

Regards,
[Your Name]
`.trim(),

  letter: ({topic, details, tone, words, language}) => `
LETTER — ${topic}

[Sender Address]
[Date]

Dear [Recipient],

${lipsum(language, words, 'letter')}

Sincerely,
[Your Name]
`.trim(),

  dialogue: ({topic, details, tone, words, language}) => `
DIALOGUE — ${topic}
A: ${lipsum(language, Math.floor(words/4), 'dialogue')}
B: ${lipsum(language, Math.floor(words/4), 'dialogue')}
A: ${lipsum(language, Math.floor(words/4), 'dialogue')}
B: ${lipsum(language, Math.floor(words/4), 'dialogue')}
`.trim(),

  report: ({topic, details, tone, words, language, formatting}) => `
${formatting === 'markdown' ? `# Report: ${topic}\n\n## Summary\n` : `REPORT: ${topic}\n\nSUMMARY:\n`}
${lipsum(language, Math.floor(words*0.4), 'report')}

${formatting === 'markdown' ? `\n## Findings\n- ` : `\nFINDINGS:\n- `}${lipsum(language, Math.floor(words*0.2), 'report')}
${formatting === 'markdown' ? `\n- ` : `\n- `}${lipsum(language, Math.floor(words*0.2), 'report')}

${formatting === 'markdown' ? `\n## Recommendation\n` : `\nRECOMMENDATION:\n`}
${lipsum(language, Math.floor(words*0.2), 'report')}
`.trim(),

  essay: ({topic, details, tone, words, language, formatting}) => `
${formatting === 'markdown' ? `# Essay: ${topic}\n` : `ESSAY: ${topic}\n`}
${lipsum(language, Math.floor(words*0.3), 'essay')}

${formatting === 'markdown' ? `\n## Body\n` : `\nBODY:\n`}
${lipsum(language, Math.floor(words*0.5), 'essay')}

${formatting === 'markdown' ? `\n## Conclusion\n` : `\nCONCLUSION:\n`}
${lipsum(language, Math.floor(words*0.2), 'essay')}
`.trim()
};

function lipsum(language, words, type) {
  const seed = (type + language).length;
  const english = "This is placeholder text so your tool works offline. Connect the free backend to generate real AI content tailored to your inputs.";
  const hindi = "यह प्लेसहोल्डर टेक्स्ट है ताकि आपका टूल ऑफ़लाइन भी काम करे। असली एआई सामग्री पाने के लिए बैकएंड जोड़ें।";
  const gujarati = "આ પ્લેસહોલ્ડર લખાણ છે જેથી તમારું ટૂલ ઓફલાઇન પણ કામ કરે. સાચું એઆઈ કન્ટેન્ટ મેળવવા બેકએન્ડ જોડો.";
  const pick = language === "Hindi" ? hindi : language === "Gujarati" ? gujarati : english;
  const arr = pick.split(" ");
  let out = [];
  for (let i = 0; i < words; i++) out.push(arr[(i + seed) % arr.length]);
  return out.join(" ");
}

async function generate() {
  const payload = {
    type: el('docType').value,
    topic: el('topic').value.trim(),
    details: el('details').value.trim(),
    tone: el('tone').value,
    words: parseInt(el('words').value, 10) || 200,
    language: el('language').value,
    formatting: el('formatting').value
  };

  el('output').value = "Generating...";

  if (BACKEND_URL) {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      el('output').value = data.text || data.output || JSON.stringify(data, null, 2);
      return;
    } catch (err) {
      console.error(err);
      // fall through to offline
    }
  }

  // Offline fallback template engine
  const fn = templates[payload.type] || templates['essay'];
  el('output').value = fn(payload);
}

function copyOut() {
  const ta = el('output');
  ta.select();
  document.execCommand('copy');
}

function downloadOut() {
  const blob = new Blob([el('output').value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${el('docType').value}-${Date.now()}.txt`; 
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  el('generateBtn').addEventListener('click', generate);
  el('copyBtn').addEventListener('click', copyOut);
  el('downloadBtn').addEventListener('click', downloadOut);
});
