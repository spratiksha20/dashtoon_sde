import React, { useState } from "react";
import './style.css';
import { RotatingLines } from 'react-loader-spinner';

function ComicGenerator() {
  const [selectedPanel, setSelectedPanel] = useState(1);
  const [panelText, setPanelText] = useState("");
  const [comicImages, setComicImages] = useState(Array(10).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  async function query(data) {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          Accept: "image/png",
          Authorization: `Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.blob();
    return URL.createObjectURL(result);
  }

  const handleTextChange = (event) => {
    setPanelText(event.target.value);
  };

  const handlePanelChange = (event) => {
    const newSelectedPanel = Number(event.target.value);
    for (let i = 0; i < newSelectedPanel; i++) {
      if (comicImages[i] === null) {
        setSelectedPanel(i + 1);
        return;
      }
    }
    setSelectedPanel(newSelectedPanel);
  };

  const generateComicPanel = async () => {
    setIsLoading(true);
    try {
      const image = await query({ inputs: panelText }).finally(() => {
        setIsLoading(false);
      });
      const updatedComicImages = [...comicImages];
      updatedComicImages[selectedPanel - 1] = image;
      setComicImages(updatedComicImages);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating comic panel:", error);
    }
  };

  return (
    <div>
      <h2>Comic Generator</h2>
      <div className="pannelParent">
        <label htmlFor="panelSelect">Select Panel:</label>
        <select
          id="panelSelect"
          value={selectedPanel}
          onChange={handlePanelChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Panel {i + 1}
            </option>
          ))}
        </select>
      </div>

      <br />
      <div className="pannelParent">
        <label htmlFor="text">Enter Text for Panel {selectedPanel}:</label>
        <input
          type="text"
          id="text"
          value={panelText}
          onChange={handleTextChange}
          placeholder="Enter text"
        />
      </div>
      <button onClick={generateComicPanel}>Generate Panel</button>

      {isLoading ? (
        <div className="Loading">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      ) : (
        <div className="comic-display">
          {comicImages.map((image, index) => (
            <div key={index} className="comic-panel">
              {image && <img src={image} alt={`Panel ${index + 1}`} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComicGenerator;
