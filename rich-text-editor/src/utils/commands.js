
export const formatText = (command, value) => {
    document.execCommand(command, false, value);
};
  
export const insertBlock = (blockType) => {
    document.execCommand('formatBlock', false, blockType);
};
  