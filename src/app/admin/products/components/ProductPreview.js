"use client";

import { useState } from "react";

export default function ProductPreview({ product, variants = [] }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const currentVariant = variants[selectedVariant] || variants[0];
  const images = product.images || [];
  const mainImage = images[selectedImage] || images[0];

  const formatPrice = (price) => {
    return `₹${Math.round(price)}`;
  };

  const getStockStatus = () => {
    if (!currentVariant) return "Out of Stock";
    return currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : "Out of Stock";
  };

  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;

  return (
    <div className="product-preview">
      <div className="preview-header">
        <h3>Product Preview</h3>
        <p>How your product will appear to customers</p>
      </div>

      {/* Product Card Preview */}
      <div className="preview-card">
        <div className="product-image-container">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="product-image-placeholder"
            style={{ display: mainImage ? 'none' : 'flex' }}
          >
            <span>No Image</span>
          </div>
          <button className="wishlist-btn">♡</button>
        </div>
        
        <div className="product-info">
          <h2 className="product-title">{product.name || "Product Name"}</h2>
          <div className="product-rating">
            <span className="stars">☆☆☆☆☆</span>
            <span className="review-count">(0 reviews)</span>
          </div>
          <p className="product-description">
            {product.description || "Product description will appear here..."}
          </p>
          <div className="product-price">
            <span className="current-price">{formatPrice(currentVariant?.price || 0)}</span>
            {currentVariant?.mrp && currentVariant.mrp > currentVariant?.price && (
              <span className="original-price">{formatPrice(currentVariant.mrp)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Product View Preview */}
      <div className="preview-detailed">
        <div className="preview-images">
          <div className="main-image-container">
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="main-image-placeholder"
              style={{ display: mainImage ? 'none' : 'flex' }}
            >
              <span>No Image Available</span>
            </div>
          </div>
          <div className="thumbnail-images">
            {images.slice(0, 3).map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={img} 
                  alt={`${product.name} ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="thumbnail-placeholder"
                  style={{ display: 'none' }}
                >
                  <span>No Image</span>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="thumbnail placeholder">
                <span>No Images</span>
              </div>
            )}
          </div>
        </div>

        <div className="preview-details">
          <div className="preview-header-section">
            <h1 className="preview-product-title">{product.name || "Product Name"}</h1>
            <button className="preview-wishlist-btn">♡</button>
          </div>
          
          <div className="preview-rating">
            <span className="preview-stars">☆☆☆☆☆</span>
            <span className="preview-review-count">(0 reviews)</span>
          </div>

          <div className="preview-description">
            {product.description || "Product description will appear here. This is where customers will read about your product features, materials, and benefits."}
          </div>

          <div className="preview-price-section">
            <span className="preview-current-price">{formatPrice(currentVariant?.price || 0)}</span>
            {currentVariant?.mrp && currentVariant.mrp > currentVariant?.price && (
              <span className="preview-original-price">{formatPrice(currentVariant.mrp)}</span>
            )}
          </div>

          <div className="preview-variants">
            <div className="size-selection">
              <label>Size</label>
              <div className="size-buttons">
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    className={`size-btn ${selectedVariant === index ? 'selected' : ''} ${variant.stock <= 0 ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedVariant(index)}
                    disabled={variant.stock <= 0}
                  >
                    {variant.size}
                    {variant.stock <= 0 && <span className="stock-label">(Out of Stock)</span>}
                  </button>
                ))}
                {variants.length === 0 && (
                  <div className="no-variants">No variants added</div>
                )}
              </div>
            </div>

            <div className="quantity-selection">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="preview-stock-status">
            {getStockStatus()}
          </div>

          <button 
            className="preview-add-to-cart"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>

          <div className="preview-reviews">
            <button className="preview-write-review">Write a Review</button>
            <p className="preview-review-prompt">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
