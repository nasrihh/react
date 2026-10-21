import { useState } from "react";
import "./ResultsPage.css";

const sampleResult = {
  fileName: "1.mp3",
  processingSeconds: 45,
  transcript:
    "در کلاس امروز چرخهٔ آب را بررسی کردیم. آب با گرمای خورشید تبخیر می‌شود. بخار آب در ارتفاعات سرد شده و ابر تشکیل می‌دهد. سپس آب به شکل باران یا برف به زمین بازمی‌گردد.",
  summary:
    "چرخهٔ آب شامل تبخیر، میعان و بارش است. خورشید انرژی لازم برای تبخیر آب را فراهم می‌کند و سرد شدن بخار آب باعث تشکیل ابر می‌شود.",
  tags: ["چرخهٔ آب", "تبخیر", "میعان", "بارش", "علوم"],
  questions: [
    "مراحل اصلی چرخهٔ آب کدام‌اند؟",
    "خورشید چه نقشی در چرخهٔ آب دارد؟",
    "ابرها چگونه تشکیل می‌شوند؟",
  ],
};

function ResultCard({ title, icon, color, copyText, children }) {
  const [copyStatus, setCopyStatus] = useState("");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus("کپی شد");
    } catch {
      setCopyStatus("کپی نشد");
    }
  }

  return (
    <section className={`result-card result-card--${color}`}>
      <div className="result-card__header">
        <h2>
          <span aria-hidden="true">{icon}</span> {title}
        </h2>
        <button
          className="copy-btn"
          type="button"
          onClick={handleCopy}
          aria-label={`کپی ${title}`}
        >
          <span aria-hidden="true">📋</span>
          {copyStatus || "کپی"}
        </button>
      </div>
      <div className="result-card__content">{children}</div>
    </section>
  );
}

export default function ResultsPage({
  result = sampleResult,
  isProcessing = false,
})
{
  function handleDownload() {
    const content = [
     ,`{result.fileName}$: نتیجه پردازش`,
      "",
      "متن کلاس",
      result.transcript,
      "",
      "خلاصه",
      result.summary,
      "",
      "برچسب‌ها",
      result.tags.join("، "),
      "",
      "سؤالات",
      ...result.questions.map((question, index) => `${index + 1}. ${question}`),
      "",
      result.processingSeconds+ "زمان 'پردازش "+"ثانیه", 
    ].join("\n");

    const blob = new Blob(["\uFEFF", content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = 
    result.fileName.replace(/\.[^.]+$/, 
      "")+"-result.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="results-page" dir="rtl">
      <div className="results-container">
        <h1>
          نتیجه پردازش: <bdi dir="ltr">{result.fileName}</bdi>
        </h1>

        {isProcessing ? (
          <div className="loading-state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            در حال پردازش فایل...
          </div>
        ) : (
          <>
            <div className="results-grid">
              <ResultCard
                title="متن کلاس"
                icon="📄"
                color="blue"
                copyText={result.transcript}
              >
                <p>{result.transcript}</p>
              </ResultCard>

              <ResultCard
                title="خلاصه"
                icon="📝"
                color="green"
                copyText={result.summary}
              >
                <p>{result.summary}</p>
              </ResultCard>
              <ResultCard
                title="سوالات"
                icon="?"
                color="purple"
                copyText={result.questions}
              >
                <p>{result.questions}</p>
              </ResultCard>

              <ResultCard
              title="برچسب‌ها"
              icon="🏷️"
              color="orange"
              copyText={result.tags.join("، ")}
             >
             <div className="tags">
             {result.tags.map((tag) => (
             <span className="tag" key={tag}>{tag}</span>
             ))}
             </div>
             </ResultCard>
             </div> {/* پایان results-grid */}

        <footer className="results-footer">
          <p>
            زمان پردازش:{" "}
            {result.processingSeconds.toLocaleString("fa-IR")} ثانیه
          </p>
          <button
            className="download-button"
            type="button"
            onClick={handleDownload}
          >
            دانلود نتیجه
          </button>
        </footer>
      </>
    )}
  </div>
</main>
);
}
              