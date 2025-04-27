import React from "react";

const SlashMenu = ({ position, options, activeIndex, setActiveIndex, onSelect }) => {
  return (
    <div
      className="slash-menu"
      role="listbox"
      aria-label="Command Menu"
    //   dynamically positionaing the slash menu.
      style={{
        position: "absolute",
        top: position.y + 20,
        left: position.x,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        minWidth: "150px",
        zIndex: 1000,
      }}
    >
        {/* rendering the options dynamically */}
        {options.map((item, index) => (
            <div
            key={item.type}
            role="option"
            aria-selected={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => onSelect(item.type)}
            style={{
                padding: "8px",
                backgroundColor: activeIndex === index ? "#eee" : "white",
                cursor: "pointer",
            }}
            >
            {item.label}
            </div>
        ))}
    </div>
  );
};

export default SlashMenu;
