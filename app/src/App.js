import React, { useState, useRef } from "react";
import "./App.css";
import Slider from "./Slider";
import SidebarItem from "./SidebarItem";

const FILTER_OPTIONS = [
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
];

function App() {
  const [selected, setSelected] = useState(0);
  const [options, setOptions] = useState(FILTER_OPTIONS);
  const selectedOption = options[selected];
  const [backgroundImage, setBackgroundImage] = useState("");
  const canvasRef = useRef(null);

  function handleSlider({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selected) return option;
        return { ...option, value: target.value };
      });
    });
  }

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(`url(${reader.result})`);
    };
    reader.readAsDataURL(file);
  };

  const updatedImageStyle = () => {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return { filter: filters.join(" ") };
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.src = backgroundImage.slice(4, -1);
    canvas.width = img.width;
    canvas.height = img.height; // Remove 'url(' and ')' from the image link
    img.onload = () => {
      context.filter = updatedImageStyle().filter;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "imageout.png";
      link.click();
    };
  };

  return (
    <div className="container">
      <div
        className="main-image"
        style={{ backgroundImage: backgroundImage, ...updatedImageStyle() }}
      />
      <div className="sidebar">
        {options.map((option, index) => (
          <SidebarItem
            key={index}
            name={option.name}
            active={index === selected}
            handleClick={() => setSelected(index)}
          />
        ))}
        <button className="file-up">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </button>

        <button onClick={handleSave} className="save_btn">
          Save
        </button>
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSlider}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
