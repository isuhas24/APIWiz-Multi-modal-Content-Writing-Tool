# APIWiz-Multi-modal-Content-Writing-Tool
Documentation for Multi-modal Content Writing Tool

LIVE URL: https://api-wiz-multi-modal-content-writing-tool.vercel.app/

1. Tech Stack & Infrastructure
* Next.js was chosen for its performance optimization features such as server-side rendering, static site generation, and automatic code splitting, which enhance user       
  experience and SEO.
* Vercel was selected for its seamless deployment process, global CDN, and built-in optimizations, ensuring fast and efficient hosting for the project.

2. Architecture Decisions
* Component Structure
  Editor.jsx — The main container for the text editor logic.
  Toolbar.jsx — A separate component for formatting buttons (e.g., Heading, Callout, Blockquote).
  SlashMenu.jsx — A contextual floating menu triggered by / for quick block insertion.
  InlineMenu.jsx - A floating toolbar that appears when the user selects text to hightlight the text.

* Utility Functions
  clipboard.js — Contains handlePaste, a utility for handling paste events cleanly inside a contentEditable div without browser quirks.
  commands.js - Exposes two key helper functions, These functions abstract the low-level usage of document.execCommand, making the code cleaner, easier to maintain, and                      easier to update in the future.

  By keeping utilities separately, the core editor logic stays clean and focused only on editing behavior.
  Splitting the editor into multiple components makes the system modular, easier to maintain, and easier to extend in the future.

* Editor Behavior
  Used a contentEditable <div> for rich text editing, ensuring flexibility over plain textarea or input.
  DOM manipulation (e.g., window.getSelection(), insertNode, Range API) is used directly to manage cursor placement and text transformations accurately.

  This decision is based on performance and precision:
  Instead of heavy libraries like Draft.js or Slate.js, lightweight DOM APIs are used for full control and minimal overhead.

3. State Management Approach
React useState is used to manage small, localized UI states.
Since the state is scoped only to the Editor component and is not shared across the app, there is no need for Redux, Context API, or other global state management.
This ensures:
  * Simplicity
  * Faster re-renders
  * Easier debugging

4. Accessibility Considerations
* Keyboard Navigation:
  => SlashMenu supports Arrow Up / Down to navigate between options.
  => Enter key selects an option.
  => Tab key behavior inside lists (ul/li) is supported (indent/outdent).

* ARIA Attributes:
  => The editor container uses role="textbox" and aria-multiline="true".
  => These attributes inform screen readers that it's a text input area that allows multiple lines.

* Focus Management:
  => The editor div has tabIndex={0}, making it reachable by keyboard (Tab key).
  => After inserting new blocks (like Callout or Quote), the caret (cursor) is moved properly inside the new block for smooth typing.

* Spellcheck and Language Support:
  => spellCheck={false} is used inside the editor.
  => dir="auto" ensures the editor can adapt to left-to-right (LTR) or right-to-left (RTL) languages dynamically based on user input.



