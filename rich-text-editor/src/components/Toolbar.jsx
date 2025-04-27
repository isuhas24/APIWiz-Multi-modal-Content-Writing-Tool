import React from "react";

// importing utils 
// util function that executes the format text operation.
import { formatText } from "@/utils/commands";

const Toolbar = ({ insertBlockAtCursor }) => {
  return (
    <div className="toolbar">
        {/* button to turn the selected text into bold */}
        <button onClick={() => formatText("bold")}><b>B</b></button>

        {/* button to turn the selected text into italics */}
        <button onClick={() => formatText("italic")}><i>I</i></button>

        {/* button to underline the selected text */}
        <button onClick={() => formatText("underline")}><u>U</u></button>

        {/* Button to insert a unordered bullet list. */}
        <button onClick={() => formatText("insertUnorderedList")}>• List</button>

        {/* inserts a h1 block or if the text is selected it is converted into h1 text */}
        <button onClick={() => insertBlockAtCursor("h1")}>H1</button>

        {/* inserts a h2 block or if the text is selected it is converted into h2 text */}
        <button onClick={() => insertBlockAtCursor("h2")}>H2</button>

        {/* inserta a blockquote element */}
        <button onClick={() => insertBlockAtCursor("blockquote")}>Quote</button>

        {/* inserts a pre element */}
        <button onClick={() => insertBlockAtCursor("pre")}>Code</button>

        {/* inserts a callout div */}
        <button onClick={() => insertBlockAtCursor("callout")}>Callout</button>
    </div>
  );
};

export default Toolbar;
