# DKB Overseas Warehouse Catalog

A professional customer-facing product catalog for DKB Flower USA warehouse ready-stock artificial floral decorations.

## Project Introduction

This project presents ready-to-ship wedding and event floral products including flower balls, wedding runners, flower arches, flower walls, aisle decorations, floral trees, and other decorations.

Sales entry pages:

- `/` and `/andy`: Andy
- `/daisy`: Daisy Han
- `/anna`: Anna Wu

Built with React + Vite so the catalog can later support inventory status, quotation requests, customer inquiry workflows, and internal quotation system connections.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Then open the local URL shown by Vite.

## Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The project is ready for Vercel deployment.

Recommended Vercel settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Updating Products

Product data is stored in:

```text
src/data/products.json
```

To update the catalog:

1. Add or edit products in `src/data/products.json`.
2. Place product images in `public/products/images/`.
3. Make sure each product's `image` field points to `/products/images/filename.jpg`.
4. Run `npm run build` before deployment.

## Product Data Format

```json
{
  "code": "FB080",
  "name": "Flower Ball",
  "category": "Flower Balls",
  "color": "White / Ivory",
  "size": "50cm",
  "price": 57,
  "priceText": "USD $57",
  "image": "/products/images/FB080.jpg"
}
```

## Future Expansion

The code structure is prepared for:

- USA warehouse inventory
- Product inquiry workflow
- Customer quotation requests
- Online quotation generator
- Connection with internal quotation systems
