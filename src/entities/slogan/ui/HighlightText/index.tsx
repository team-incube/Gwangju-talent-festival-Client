import React from "react";

interface HighlightTextProps {
  text: string;
  searchTerm: string;
  highlightClassName?: string;
}

const HighlightText = ({ 
  text, 
  searchTerm, 
  highlightClassName = "text-main-600 font-semibold" 
}: HighlightTextProps) => {
  if (!searchTerm.trim()) {
    return <span>{text}</span>;
  }

  const normalizedSearchTerm = searchTerm.replace(/\s+/g, '');
  
  if (!normalizedSearchTerm) {
    return <span>{text}</span>;
  }

  const matchIndex = text.replace(/\s+/g, '').indexOf(normalizedSearchTerm);
  
  if (matchIndex === -1) {
    return <span>{text}</span>;
  }

  let charCount = 0;
  let startIndex = 0;
  let endIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    if (!/\s/.test(text[i])) {
      if (charCount === matchIndex) {
        startIndex = i;
        break;
      }
      charCount++;
    }
  }
  
  charCount = 0;
  for (let i = startIndex; i < text.length; i++) {
    if (!/\s/.test(text[i])) {
      charCount++;
      if (charCount === normalizedSearchTerm.length) {
        endIndex = i + 1;
        break;
      }
    } else if (charCount > 0) {
      endIndex = i + 1;
    }
  }

  return (
    <span>
      {text.substring(0, startIndex)}
      <span className={highlightClassName}>{text.substring(startIndex, endIndex)}</span>
      {text.substring(endIndex)}
    </span>
  );
};

export default React.memo(HighlightText); 