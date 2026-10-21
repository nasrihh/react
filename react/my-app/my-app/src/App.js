import { useState } from "react";
import ResultsPage from "./ResultsPage";
import logo from "./assets/logo.jpg";
import "./App.css";

function App() {
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const upload = async (e) => {
    e.preventDefault();

    if (!audio) {
      setMessage("لطفاً یک فایل صوتی انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audio);

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8001/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطای ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setMessage(`آپلود انجام نشد: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (result !== null) {
    return <ResultsPage data={result} />;
  }
  <div>
    <img src="src/photo_2026-10-20_07-22-39.jpg" alt="" />
  </div>;

  return (
    <div className="upload-page" dir="rtl">
      <form className="upload-form-container" onSubmit={upload}>
        <div className="logo-container">
          <img src={logo} alt="لوگوی سایت" className="upload-logo"></img>
        </div>
        <label htmlFor="audio" className="file-label">
          آپلود صدا
        </label>

        <input
          type="file"
          accept="audio/*"
          name="audio"
          id="audio"
          className="file-input"
          disabled={loading}
          onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
        />

        <button type="submit" disabled={!audio || loading}>
          {loading ? "در حال پردازش..." : "آپلود"}
        </button>

        {loading && (
          <div className="upload-loading" role="status" aria-live="polite">
            <span className="upload-spinner" aria-hidden="true" />
            <span>فایل ارسال شد؛ منتظر دریافت نتیجه بمانید.</span>
          </div>
        )}

        {message && !loading && <p role="status">{message}</p>}
      </form>
    </div>
  );
}

export default App;
