export const handlePaste = (e) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    if (htmlData) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
  
      // Inserting the html data.
      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    } else if (textData) {
      // inserting plain text if HTML is not available.
      document.execCommand('insertText', false, textData);
    }
};
  