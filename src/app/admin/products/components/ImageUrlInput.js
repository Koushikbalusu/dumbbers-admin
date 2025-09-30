"use client";

import { useState, useEffect } from "react";

export default function ImageUrlInput({ value = [], onChange }) {
  const [urls, setUrls] = useState(value.length > 0 ? value : [""]);

  useEffect(() => {
    if (value.length > 0) {
      setUrls(value);
    }
  }, [value]);

  const looksLikeUrl = (string) => {
    const trimmed = string.trim();
    if (!trimmed) return false;
    
    // Check if it looks like a URL (contains . and has some structure)
    const urlPattern = /^https?:\/\/.+\./i;
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/;
    const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    
    return urlPattern.test(trimmed) || 
           domainPattern.test(trimmed) || 
           imagePattern.test(trimmed) ||
           (trimmed.includes('.') && trimmed.length > 5);
  };

  const handleUrlChange = (index, newUrl) => {
    const newUrls = [...urls];
    newUrls[index] = newUrl;
    setUrls(newUrls);
    onChange(newUrls.filter(url => url.trim() !== ""));
  };

  const handleUrlBlur = (index) => {
    const currentUrl = urls[index];
    
    // Add new input if this is the last input and it looks like a URL
    if (index === urls.length - 1 && currentUrl && currentUrl.trim() !== "" && looksLikeUrl(currentUrl.trim())) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    onChange(newUrls.filter(url => url.trim() !== ""));
  };

  const addEmptyUrl = () => {
    setUrls([...urls, ""]);
  };

  return (
    <div className="form-group">
      <label>Product Images</label>
      <div className="image-urls-container">
        {urls.map((url, index) => (
          <div key={index} className="image-url-input">
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              onBlur={() => handleUrlBlur(index)}
              placeholder="https://example.com/image.jpg"
              style={{ marginBottom: 0 }}
            />
            {urls.length > 1 && (
              <button
                type="button"
                className="remove-url-btn"
                onClick={() => removeUrl(index)}
                title="Remove image URL"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={addEmptyUrl}
          style={{ alignSelf: "flex-start", marginTop: 8 }}
        >
          + Add Image URL
        </button>
      </div>
    </div>
  );
}
