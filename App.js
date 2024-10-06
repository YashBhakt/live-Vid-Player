
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import axios from "axios";
import './App.css'; 

const App = () => {
  const [overlays, setOverlays] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
   
    axios.get("http://localhost:5000/api/overlays").then((response) => {
      setOverlays(response.data);
    });
  }, []);

  const addOverlay = (type) => {
    const newOverlay = {
      id: Date.now(),
      type,
      content: type === "text" ? "Sample Text" : "/path/to/logo.png",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
    };
    setOverlays([...overlays, newOverlay]);
  
    axios.post("http://localhost:5000/api/overlays", newOverlay);
  };

  const updateOverlay = (updatedOverlay) => {
    setOverlays((prevOverlays) =>
      prevOverlays.map((o) => (o.id === updatedOverlay.id ? updatedOverlay : o))
    );
    axios.put(`http://localhost:5000/api/overlays/${updatedOverlay.id}`, updatedOverlay);
  };

  const deleteOverlay = (id) => {
    setOverlays(overlays.filter((overlay) => overlay.id !== id));
    axios.delete(`http://localhost:5000/api/overlays${id}`);
  };

  return (
    <div className="App">
      <div className="player-wrapper">
        <ReactPlayer
          url="RTSP stream"
          playing={isPlaying}
          controls
          volume={volume}
          className="react-player"
          width="100%"
          height="100%"
        />
        {overlays.map((overlay) => (
          <Draggable
            key={overlay.id}
            position={overlay.position}
            onStop={(e, data) => {
              updateOverlay({ ...overlay, position: { x: data.x, y: data.y } });
            }}
          >
            <Resizable
              size={overlay.size}
              onResizeStop={(e, direction, ref, d) => {
                updateOverlay({
                  ...overlay,
                  size: {
                    width: ref.style.width,
                    height: ref.style.height,
                  },
                });
              }}
            >
              {overlay.type === "text" ? (
                <div className="text-overlay">{overlay.content}</div>
              ) : (
                <img src={overlay.content} alt="logo" className="image-overlay" />
              )}
            </Resizable>
          </Draggable>
        ))}
      </div>
      <div className="controls">
        <button onClick={() => addOverlay("text")}>Add Text</button>
        <button onClick={() => addOverlay("logo")}>Add Logo</button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default App;
