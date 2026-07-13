import { useMemo, useState } from 'react';
import { Check, Clipboard, Mail, MessageCircle, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import products from './data/products.json';

const categoryOrder = [
  'Wedding Centerpieces',
  'Flower Balls',
  'Flower Arches',
  'Flower Walls',
  'Table Runners',
  'Aisle Decorations',
  'Floral Trees',
  'Other Decorations'
];

const colorOrder = [
  'White / Ivory',
  'Pink',
  'Red',
  'Burgundy',
  'Autumn',
  'Green',
  'Blue',
  'Purple',
  'Mixed Color'
];

const categoryAliases = {
  'Table Runners': 'Wedding Centerpieces'
};

function displayCategory(product) {
  return categoryAliases[product.category] || product.category;
}

function sortByOrder(items, order) {
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.localeCompare(b);
  });
}

function priceText(product) {
  return product.priceText || `USD $${product.price}`;
}

function buildSearchText(product) {
  return [
    product.code,
    product.name,
    product.size,
    priceText(product),
    product.category,
    displayCategory(product),
    product.color
  ].join(' ').toLowerCase();
}

function App() {
  const [mode, setMode] = useState('type');
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryItems, setInquiryItems] = useState([]);

  const normalizedProducts = useMemo(
    () => products.map((product) => ({ ...product, displayCategory: displayCategory(product) })),
    []
  );

  const heroProducts = useMemo(() => {
    const wanted = ['FB080', 'TR187', 'ARCH466', 'HQA023'];
    return wanted.map((code) => normalizedProducts.find((product) => product.code === code)).filter(Boolean);
  }, [normalizedProducts]);

  const filters = useMemo(() => {
    const values = new Set(normalizedProducts.map((product) => (mode === 'type' ? product.displayCategory : product.color)));
    return mode === 'type' ? sortByOrder(values, categoryOrder) : sortByOrder(values, colorOrder);
  }, [mode, normalizedProducts]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalizedProducts.filter((product) => {
      const groupValue = mode === 'type' ? product.displayCategory : product.color;
      const filterMatch = activeFilter === 'All' || groupValue === activeFilter;
      const queryMatch = !q || buildSearchText(product).includes(q);
      return filterMatch && queryMatch;
    });
  }, [activeFilter, mode, normalizedProducts, query]);

  const groupedProducts = useMemo(() => {
    const map = new Map();
    filteredProducts.forEach((product) => {
      const key = mode === 'type' ? product.displayCategory : product.color;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(product);
    });
    const order = mode === 'type' ? categoryOrder : colorOrder;
    return sortByOrder(map.keys(), order).map((key) => [key, map.get(key)]);
  }, [filteredProducts, mode]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setActiveFilter('All');
  }

  async function copyCode(code) {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(''), 1600);
  }

  function addInquiry(product) {
    setInquiryItems((items) => {
      const existing = items.find((item) => item.code === product.code);
      if (existing) {
        return items.map((item) => item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, { code: product.code, quantity: 1 }];
    });
    setInquiryOpen(true);
  }

  function updateQuantity(code, delta) {
    setInquiryItems((items) =>
      items
        .map((item) => item.code === code ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  }

  function removeInquiry(code) {
    setInquiryItems((items) => items.filter((item) => item.code !== code));
  }

  const inquiryMailBody = encodeURIComponent([
    'Hello DKB Flower,',
    '',
    'I am interested in the following products:',
    '',
    ...inquiryItems.flatMap((item) => [item.code, `Quantity: ${item.quantity}`, '']),
    'Please provide quotation and availability.',
    '',
    'Thank you.'
  ].join('\n'));

  const inquiryHref = `mailto:info@dkbflower.com?subject=${encodeURIComponent('USA Warehouse Product Inquiry')}&body=${inquiryMailBody}`;

  return (
    <>
      <div className="notice">USA Warehouse Ready Stock · Fast Delivery · Wedding & Event Solutions</div>
      <header className="site-nav">
        <a className="brand" href="#top">DKB FLOWER</a>
        <nav>
          <a href="#products">Products</a>
          <a href="#order">How To Order</a>
          <a href="#shipping">Shipping</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="inquiry-pill" type="button" onClick={() => setInquiryOpen(true)}>
          <ShoppingBag size={16} />
          Inquiry List ({inquiryItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">DKB Flower · USA Warehouse Catalog</p>
            <h1>USA Warehouse Ready Stock</h1>
            <p className="hero-subtitle">Ready-to-ship artificial floral decorations for weddings, events and venues.</p>
            <div className="value-points">
              <span><Check size={16} /> USA Warehouse Stock</span>
              <span><Check size={16} /> Fast Delivery</span>
              <span><Check size={16} /> Wedding & Event Solutions</span>
            </div>
            <div className="hero-actions">
              <a className="button dark" href="#products">Browse Products</a>
              <a className="button light" href="https://wa.me/8619937076186">WhatsApp Us</a>
            </div>
          </div>
          <div className="hero-gallery" aria-label="Featured products">
            {heroProducts.map((product) => (
              <button className="hero-tile" key={product.code} onClick={() => setSelectedProduct(product)} type="button">
                <img src={product.image} alt={product.name} />
                <span>{product.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="stats" aria-label="Catalog highlights">
          <div><strong>{normalizedProducts.length}</strong><span>Products</span></div>
          <div><strong>USA</strong><span>Warehouse</span></div>
          <div><strong>Fast</strong><span>Delivery Options</span></div>
          <div><strong>Event</strong><span>Solutions</span></div>
        </section>

        <section className="catalog-section" id="products">
          <div className="toolbar">
            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search code, size, color, category, price..." />
            </label>
            <div className="mode-toggle" aria-label="Browse mode">
              <button className={mode === 'type' ? 'active' : ''} onClick={() => switchMode('type')} type="button">Sort by Type</button>
              <button className={mode === 'color' ? 'active' : ''} onClick={() => switchMode('color')} type="button">Sort by Color</button>
            </div>
            <div className="chips">
              <button className={activeFilter === 'All' ? 'active' : ''} onClick={() => setActiveFilter('All')} type="button">All</button>
              {filters.map((filter) => (
                <button className={activeFilter === filter ? 'active' : ''} key={filter} onClick={() => setActiveFilter(filter)} type="button">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <p className="result-note">{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} shown</p>
          {filteredProducts.length === 0 ? (
            <div className="empty-state">No products found. Try another keyword or filter.</div>
          ) : (
            groupedProducts.map(([group, items]) => (
              <section className="product-group" key={group}>
                <div className="group-head">
                  <h2>{group}</h2>
                  <span>{items.length} items</span>
                </div>
                <div className="product-grid">
                  {items.map((product) => (
                    <article className="product-card" key={product.code}>
                      <button className="image-frame" onClick={() => setSelectedProduct(product)} type="button">
                        <img src={product.image} alt={`${product.code} ${product.name}`} loading="lazy" />
                      </button>
                      <div className="card-body">
                        <div className="card-top">
                          <div>
                            <p className="label">Product Code</p>
                            <h3>{product.code}</h3>
                          </div>
                          <strong>{priceText(product)}</strong>
                        </div>
                        <p>Size: {product.size || '-'}</p>
                        <div className="badges">
                          <span>{product.displayCategory}</span>
                          <span>{product.color}</span>
                          <span>USA Stock</span>
                        </div>
                        <div className="card-actions">
                          <button type="button" onClick={() => copyCode(product.code)}>
                            <Clipboard size={15} />
                            {copiedCode === product.code ? 'Copied' : 'Copy Product Code'}
                          </button>
                          <button className="accent" type="button" onClick={() => addInquiry(product)}>
                            <Plus size={15} />
                            Add Inquiry
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </section>

        <section className="info-band" id="order">
          <div>
            <p className="eyebrow">How To Order</p>
            <h2>Simple ordering for event projects</h2>
          </div>
          <div className="steps">
            <article><span>Step 1</span><p>Choose products and product codes</p></article>
            <article><span>Step 2</span><p>Send us product codes and quantities</p></article>
            <article><span>Step 3</span><p>We confirm availability and shipping</p></article>
            <article><span>Step 4</span><p>Production / Delivery arrangement</p></article>
          </div>
        </section>

        <section className="shipping" id="shipping">
          <p className="eyebrow">Shipping Information</p>
          <h2>USA Warehouse Ready Stock</h2>
          <p>Ready stock products are available for fast delivery. Please contact us for current inventory and shipping options.</p>
        </section>

        <section className="cta" id="contact">
          <div>
            <p className="eyebrow">Contact Sales</p>
            <h2>Send us the product codes to order.</h2>
            <p>Please send product codes, quantities, and your event date. We will confirm availability and next steps.</p>
            <p className="contact-line">Tel / WhatsApp: +86 19937076186 · Andy</p>
          </div>
          <div className="cta-actions">
            <a className="button dark" href="mailto:info@dkbflower.com"><Mail size={18} /> Email Sales</a>
            <a className="button light" href="https://wa.me/8619937076186"><MessageCircle size={18} /> WhatsApp Us</a>
          </div>
        </section>
      </main>

      <footer>DKB FLOWER · USA Warehouse Ready Stock · Wedding Artificial Flowers</footer>

      {selectedProduct && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setSelectedProduct(null)}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setSelectedProduct(null)} type="button"><X size={22} /></button>
            <div className="modal-image"><img src={selectedProduct.image} alt={selectedProduct.code} /></div>
            <div className="modal-info">
              <p className="label">Product Code</p>
              <h3>{selectedProduct.code}</h3>
              <strong>{priceText(selectedProduct)}</strong>
              <p>Size: {selectedProduct.size || '-'}</p>
              <div className="badges">
                <span>{selectedProduct.displayCategory}</span>
                <span>{selectedProduct.color}</span>
                <span>USA Stock</span>
              </div>
              <button className="button dark full" onClick={() => addInquiry(selectedProduct)} type="button">Add Inquiry</button>
            </div>
          </div>
        </div>
      )}

      {inquiryOpen && (
        <aside className="drawer" aria-label="Inquiry list">
          <div className="drawer-head">
            <div>
              <p className="eyebrow">Inquiry List</p>
              <h2>{inquiryItems.length} selected product{inquiryItems.length === 1 ? '' : 's'}</h2>
            </div>
            <button className="icon-button" onClick={() => setInquiryOpen(false)} type="button"><X size={22} /></button>
          </div>
          {inquiryItems.length === 0 ? (
            <p className="drawer-empty">Add products to build an inquiry list.</p>
          ) : (
            <>
              <div className="inquiry-list">
                {inquiryItems.map((item) => (
                  <div className="inquiry-row" key={item.code}>
                    <strong>{item.code}</strong>
                    <div className="qty">
                      <button onClick={() => updateQuantity(item.code, -1)} type="button"><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.code, 1)} type="button"><Plus size={14} /></button>
                    </div>
                    <button className="remove" onClick={() => removeInquiry(item.code)} type="button">Remove</button>
                  </div>
                ))}
              </div>
              <a className="button dark full" href={inquiryHref}>Send Inquiry</a>
            </>
          )}
        </aside>
      )}
    </>
  );
}

export default App;
