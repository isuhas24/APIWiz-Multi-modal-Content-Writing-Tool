"use client";

import React, { useState, useRef } from "react";
import styles from '../../src/styles/editor.module.css';
import Toolbar from "./Toolbar";
import SlashMenu from "./SlashMenu";
// importing the utils
// util function that handles the paste event.
import { handlePaste } from "@/utils/clipboard";

const Editor = () => {
    const editorRef = useRef(null);
    // state variable to control visibility of slash menu.
    const [showSlashMenu, setShowSlashMenu] = useState(false);

    // state variable to control the position of slash menu.
    const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 });

    const [command, setCommand] = useState('');

    // state variable to track the slash menu active index.
    const [activeMenuIndex, setActiveMenuIndex] = useState(0);

    // state variable to handle complex character composition.
    const [isComposing, setIsComposing] = useState(false);

    const inlineCommands = [
        { label: "H1 Heading", type: "h1" },
        { label: "H2 Subheading", type: "h2" },
        { label: "Blockquote", type: "blockquote" },
        { label: "Code Block", type: "pre" },
        { label: "Callout", type: "callout" },
    ];

    // This is the method passed on to the toolbar component, Inserts a specific block at the cursor position inside the editor.
    const insertBlockAtCursor = (blockType) => {
        // obtaining the user selected text or where the user cursor is.
        const selection = window.getSelection();
        // obtaining the start and end point of the selected text.
        // const range = selection?.getRangeAt(0);
        let range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        const editor = editorRef.current;

        if (!selection || !editor) return;

        if (!range || !editor.contains(range.startContainer)) {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // block of code that executes only if text is selected and cursor is not just blinking.
        if (!selection.isCollapsed) {
            // extracting the selected text.
            const selectedContent = range.extractContents();

            const wrapper = document.createElement(blockType);
            wrapper.appendChild(selectedContent);
            wrapper.classList.add("editor_block");
            // Inserting the new block with selected text inside into the editor where the old text was.
            range.insertNode(wrapper);

            // Move the cursor after the newly inserted block
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStartAfter(wrapper);
            newRange.collapse(true);
            selection.addRange(newRange);
            setShowSlashMenu(false);
            return;
        }

        // block of code that only executes if the user has not selected any text.
        let newElement;
        // now based on the passed blocktype the blocks are created and inserted into the editor.
        if (blockType === "blockquote") {
            newElement = document.createElement("blockquote");
            newElement.classList.add("editor_block");
            newElement.innerHTML = "<p>Blockquote</p>";
        } else if (blockType === "pre") {
            newElement = document.createElement("pre");
            newElement.classList.add("editor_block");
            newElement.innerHTML = "<code>Code block</code>";
        } else if (blockType === "callout") {
            newElement = document.createElement("div");
            newElement.classList.add("editor_block", styles.callout);
            newElement.innerHTML = "<p>Callout</p>";
        } else if (blockType === "h1" || blockType === "h2") {
            newElement = document.createElement(blockType);
            newElement.classList.add("editor_block");
            newElement.textContent = "New " + blockType.toUpperCase();
        } else {
            newElement = document.createElement("p");
            newElement.classList.add("editor_block");
            newElement.textContent = "New Block";
        }

        range.deleteContents();
        // Inserting the new block right at the cursor
        range.insertNode(newElement);

        // code block to move the cursor inside the newly created block.
        const rangeAfterInsert = document.createRange();
        const textNode = newElement.querySelector("p") || newElement;
        rangeAfterInsert.selectNodeContents(textNode);
        rangeAfterInsert.collapse(true);
        selection.removeAllRanges();
        selection.addRange(rangeAfterInsert);

        setShowSlashMenu(false);
    };

    const handleKeyDown = (e) => {
        // if the user is typing complex characters then return
        if (isComposing) return;

        if (e.key === "/") {
            // to obtain the selected text.
            const selection = window.getSelection();
            // current highlighted area.
            const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            //   const range = selection?.getRangeAt(0);
            // obtaining the exact screen coordinates.
            if (range) {
                const rect = range.getBoundingClientRect();
                setSlashPosition({ x: rect.left, y: rect.top });
            }
            // making sure the slash menu shows up now.
            setShowSlashMenu(true);
            setCommand('');
            return;
        }

        // to handle cmd+shift+8 or Ctrl+Shift+8 click and to insert an unordered list
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "8") {
            e.preventDefault();
            document.execCommand("insertUnorderedList");
        }

        // handling the arrow key clicks inside the slash menu.
        if (showSlashMenu) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveMenuIndex((prev) => (prev + 1) % inlineCommands.length);
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveMenuIndex((prev) => (prev - 1 + inlineCommands.length) % inlineCommands.length);
            }
            // this handles the menu option click.
            if (e.key === "Enter") {
                e.preventDefault();
                insertBlockAtCursor(inlineCommands[activeMenuIndex].type);
            }
            if (e.key === "Backspace" && command !== "") {
                setCommand(command.slice(0, -1));
            }
            // handle typing while slash menu is open
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                setCommand((prev) => prev + e.key);
            }
            return;
        }

        // block to handle tab button click within the editor block.
        if (e.key === "Tab") {
            // preventing the normal tabbing behavior.
            e.preventDefault();
            // obtaining the selected text
            const selection = window.getSelection();
            // if no text selected just return
            if (!selection) return;
            const focusNode = selection.focusNode;
            if (!focusNode) return;

            // block of code to handle indentation of list items.
            let liNode = focusNode.parentNode;
            // Traversing up the DOM tree to find the nearest <li>
            while (liNode && liNode.nodeName !== "LI") {
                liNode = liNode.parentNode;
            }

            if (liNode && liNode.nodeName === "LI") {
                // this is shift+tab key click
                if (e.shiftKey) {
                    document.execCommand("outdent");
                } else {
                    document.execCommand("indent");
                }
            }
        }
    };

    const handleMouseUp = () => {
        setShowSlashMenu(false);
    };

    return (
        <div className={styles.editor_container}>
            {/* tool bar component with formatting options */}
            <Toolbar insertBlockAtCursor={insertBlockAtCursor} />

            {/* rich text editor section */}
            <div
                ref={editorRef}
                className={styles.editor}
                // makes the <div> editable.
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                // event to handle paste
                onPaste={handlePaste}
                // temporarily pauses and resumes handling normal key events.
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onMouseUp={handleMouseUp}
                // To disable browser spellchecking inside the editor.
                spellCheck={false}
                // ARIA role for accessibility
                role="textbox"
                aria-multiline="true"
                // to handle both left-to-right as well as right-to-left languages.
                dir="auto"
                // to add the div into the normal tabbing order.
                tabIndex={0}
            ></div>

            {/* slash menu component displayed based on the passed position. */}
            {showSlashMenu && (
                <SlashMenu
                position={slashPosition}
                options={inlineCommands}
                activeIndex={activeMenuIndex}
                setActiveIndex={setActiveMenuIndex}
                onSelect={insertBlockAtCursor}
                />
            )}
        </div>
    );
};

export default Editor;
