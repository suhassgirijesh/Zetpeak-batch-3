import React from "react";
import "./ExportButtons.css";

export default function ExportButtons({ storyboardId }) {
  const handleExport = (type) => {
    if (!storyboardId) return;
    const url =
      type === "pdf"
        ? `http://localhost:5000/export_pdf?storyboard_id=${storyboardId}`
        : `http://localhost:5000/export_pptx?storyboard_id=${storyboardId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="export-buttons">
      <button
        className="export-btn"
        onClick={() => handleExport("pdf")}
        disabled={!storyboardId}
      >
        Export as PDF
      </button>
      <button
        className="export-btn pptx"
        onClick={() => handleExport("pptx")}
        disabled={!storyboardId}
      >
        Export as PPTX
      </button>
    </div>
  );
}
