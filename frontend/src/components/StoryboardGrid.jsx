import React from "react";
import "./StoryboardGrid.css";

export default function StoryboardGrid({ storyboard, aspectRatio, onEditScene }) {
  return (
    <div className="storyboard-grid">
      {storyboard.map((scene, idx) => (
        <div key={scene.scene_number} className="storyboard-panel">
          <div
            className="storyboard-image-container"
            style={{
              aspectRatio: aspectRatio === "16:9" ? "16/9" : "4/3",
              width: "100%",
              maxHeight: "300px",
              overflow: "hidden",
            }}
          >
            <img
              src={`data:image/png;base64,${scene.image}`}
              alt={`Scene ${scene.scene_number}`}
              className="storyboard-image"
            />
          </div>
          <textarea
            className="storyboard-desc"
            value={scene.visual_description}
            onChange={(e) => onEditScene(idx, e.target.value)}
          />
          <div className="storyboard-dialogue">
            <strong>Dialogue:</strong> {scene.dialogue}
          </div>
        </div>
      ))}
    </div>
  );
}
