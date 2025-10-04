"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminAPI } from "../../../../lib/api";
import ImageUrlInput from "../components/ImageUrlInput";
import ProductPreview from "../components/ProductPreview";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "",
    gender: "UNISEX",
    category: "",
    description: "",
    tags: [],
    images: [],
    attributes: { fit: "REGULAR", sleeve: "SHORT", neck: "CREW", material: "BLEND", pattern: "SOLID" },
    variants: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const data = await adminAPI.getProduct(id);
          setForm({
            ...data.product,
            tags: data.product.tags || [],
            images: data.product.images || [],
          });
        } catch (e) { alert(e.message || "Load failed"); }
      })();
    } else {
      // Initialize default variants for new products
      setForm(prev => ({
        ...prev,
        variants: generateDefaultVariants()
      }));
    }
  }, [id, isNew]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const generateDefaultVariants = (productName = "") => {
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const baseSku = productName ? productName.toUpperCase().replace(/\s+/g, "-") + "-AWB" : "PRODUCT-AWB";
    
    return sizes.map(size => ({
      size,
      color: "Black",
      colorCode: "#000000",
      sku: `${baseSku}-${size}`,
      mrp: 0,
      price: 0,
      stock: size === "XS" || size === "XXL" ? 0 : 100,
      images: []
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) {
        await adminAPI.createProduct({ ...form });
      } else {
        await adminAPI.updateProduct(id, { ...form });
      }
      router.push("/admin/products");
    } catch (e) { alert(e.message || "Save failed"); }
    finally { setLoading(false); }
  };

  const updateVariantsWithNewName = (newName) => {
    const baseSku = newName ? newName.toUpperCase().replace(/\s+/g, "-") + "-AWB" : "PRODUCT-AWB";
    setForm(f => ({
      ...f,
      variants: f.variants.map(variant => ({
        ...variant,
        sku: `${baseSku}-${variant.size}`
      }))
    }));
  };

  const addVariant = () => {
    const baseSku = form.name ? form.name.toUpperCase().replace(/\s+/g, "-") + "-AWB" : "PRODUCT-AWB";
    const newVariant = {
      size: "M",
      color: "Black", 
      colorCode: "#000000",
      sku: `${baseSku}-M`,
      mrp: 0,
      price: 0,
      stock: 100,
      images: []
    };
    setForm(f => ({ ...f, variants: [...f.variants, newVariant] }));
  };

  const updateVariant = (idx, patch) => {
    setForm(f => {
      const newVariants = f.variants.map((v, i) => 
        i === idx ? { ...v, ...patch } : v
      );
      
      // If updating MRP or price, update all variants to match
      if (patch.mrp !== undefined || patch.price !== undefined) {
        const updatedVariant = newVariants[idx];
        return {
          ...f,
          variants: newVariants.map(v => ({
            ...v,
            mrp: updatedVariant.mrp,
            price: updatedVariant.price
          }))
        };
      }
      
      return { ...f, variants: newVariants };
    });
  };

  const removeVariant = (idx) => setForm(f => ({ ...f, variants: f.variants.filter((_,i)=> i!==idx) }));

  return (
    <div className="grid gap-6">
      <form className="grid gap-6" onSubmit={onSubmit}>
        <div className="form-section">
          <div className="nav-title" style={{ marginBottom: 20 }}>Product Information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="required">Name</label>
              <input 
                value={form.name} 
                onChange={e => {
                  set("name", e.target.value);
                  // Update SKUs when name changes
                  if (isNew) {
                    updateVariantsWithNewName(e.target.value);
                  }
                }} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="required">Slug</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)} required={isNew} />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input value={form.brand} onChange={e => set("brand", e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}>
                {["MEN","WOMEN","UNISEX"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="required">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} />
          </div>
          <div className="form-group">
            <ImageUrlInput 
              value={form.images} 
              onChange={(images) => set("images", images)} 
            />
          </div>
        </div>

        <div className="form-section">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="nav-title">Product Variants</div>
            <div className="row" style={{ gap: 8 }}>
              {isNew && (
                <button 
                  type="button" 
                  onClick={() => setForm(f => ({ ...f, variants: generateDefaultVariants(form.name) }))} 
                  className="btn-secondary"
                >
                  Reset to Defaults
                </button>
              )}
              <button type="button" onClick={addVariant} className="btn-secondary">Add Variant</button>
            </div>
          </div>
          <div style={{ 
            background: "#e8f5e8", 
            border: "1px solid #4caf50", 
            borderRadius: "4px", 
            padding: "12px", 
            marginBottom: "16px",
            fontSize: "14px",
            color: "#2e7d32"
          }}>
            <strong>💡 Pricing Sync:</strong> When you update MRP or Price for any variant, all variants will automatically update to match the same pricing.
          </div>
          <div className="grid gap-6">
            {form.variants.map((v, idx) => (
              <div key={idx} className="card" style={{ padding: 16 }}>
                <div className="form-row">
                <div className="form-group">
                  <label className="required">Size</label>
                  <input 
                    value={v.size} 
                    onChange={e => {
                      const newSize = e.target.value;
                      const baseSku = form.name ? form.name.toUpperCase().replace(/\s+/g, "-") + "-AWB" : "PRODUCT-AWB";
                      updateVariant(idx, { 
                        size: newSize,
                        sku: `${baseSku}-${newSize}`
                      });
                    }} 
                    required 
                  />
                </div>
                  <div className="form-group">
                    <label className="required">Color</label>
                    <input value={v.color} onChange={e => updateVariant(idx, { color: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="required">SKU</label>
                    <input value={v.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Color Code</label>
                    <input value={v.colorCode||""} onChange={e => updateVariant(idx, { colorCode: e.target.value })} placeholder="#000000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">MRP (₹) <span style={{ color: "#4caf50", fontSize: "12px" }}>🔄 Synced</span></label>
                    <input type="number" value={v.mrp} onChange={e => updateVariant(idx, { mrp: Number(e.target.value) })} required min="0" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label className="required">Price (₹) <span style={{ color: "#4caf50", fontSize: "12px" }}>🔄 Synced</span></label>
                    <input type="number" value={v.price} onChange={e => updateVariant(idx, { price: Number(e.target.value) })} required min="0" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label className="required">Stock</label>
                    <input type="number" value={v.stock} onChange={e => updateVariant(idx, { stock: Number(e.target.value) })} required min="0" />
                  </div>
                  <div className="form-group" style={{ alignSelf: "end" }}>
                    <button type="button" className="btn-danger" onClick={() => removeVariant(idx)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            {!form.variants.length && (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "#666" }}>
                No variants added. Click "Add Variant" to create one.
              </div>
            )}
          </div>
        </div>

        <div className="row" style={{ justifyContent: "flex-end", marginTop: 24 }}>
          <button type="submit" disabled={loading} className="btn-primary">{isNew ? "Create" : "Save"}</button>
        </div>
      </form>

      {/* Product Preview */}
      <ProductPreview 
        product={form} 
        variants={form.variants} 
      />
    </div>
  );
}


