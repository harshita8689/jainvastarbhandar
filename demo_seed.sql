-- ==============================================================================
-- JAIN VASTAR BHANDAR (JVB) - OPTIONAL SAMPLE DEMO DATA
-- NOTE: ALL ITEMS ARE EXPLICITLY LABELED AS [DEMO DATA]
-- Run this in Supabase SQL editor ONLY if you wish to see sample data in your storefront.
-- You can easily delete these later from the Admin Dashboard or via SQL.
-- ==============================================================================

INSERT INTO public.products (sku, name, slug, description, price, sale_price, fabric_type, color, pattern, included_material, stock_quantity, status, is_featured)
VALUES
(
  'DEMO-COT-01',
  '[DEMO DATA] Traditional Jaipuri Pure Cotton Unstitched Suit',
  'demo-traditional-jaipuri-pure-cotton-unstitched-suit',
  'Crafted from 100% fine count pure unstitched cotton fabric featuring authentic handblock motifs and a breathable, feather-light mulmul dupatta. Ideal for daily comfort and elegant daytime gatherings.',
  2150.00,
  NULL,
  'Pure Cotton',
  'Fuchsia Pink',
  'Handblock Print',
  'Kurta Fabric: 2.5m, Salwar/Bottom: 2.5m, Mulmul Dupatta: 2.25m',
  15,
  'published',
  true
),
(
  'DEMO-CHA-02',
  '[DEMO DATA] Royal Chanderi Silk Zari Weave Unstitched Suit',
  'demo-royal-chanderi-silk-zari-weave-unstitched-suit',
  'Unstitched Chanderi silk fabric woven with traditional gold zari boota motifs and an intricately woven border dupatta. Perfect for festive and family celebrations.',
  3650.00,
  3350.00,
  'Chanderi Silk',
  'Burgundy Wine',
  'Zari Weaving',
  'Kurta Fabric: 2.5m, Santoon Bottom: 2.5m, Chanderi Woven Dupatta: 2.3m',
  8,
  'published',
  true
),
(
  'DEMO-GEO-03',
  '[DEMO DATA] Chikankari Thread Embroidered Georgette Suit Material',
  'demo-chikankari-thread-embroidered-georgette-suit-material',
  'Delicate unstitched viscose georgette suit fabric enriched with fine Lucknowi-inspired threadwork and soft lining material included.',
  4200.00,
  NULL,
  'Georgette',
  'Ivory Beige',
  'Thread Embroidery',
  'Kurta Fabric: 2.5m, Inner & Bottom: 4.0m, Embroidered Dupatta: 2.25m',
  6,
  'published',
  true
),
(
  'DEMO-MOD-04',
  '[DEMO DATA] Ajrakh Print Modal Silk Unstitched Suit Set',
  'demo-ajrakh-print-modal-silk-unstitched-suit-set',
  'Silky smooth modal fabric featuring heritage Ajrakh geometric handblock patterns and a lustrous matching modal silk dupatta.',
  3890.00,
  NULL,
  'Modal Silk',
  'Deep Wine & Indigo',
  'Ajrakh Block Print',
  'Kurta Fabric: 2.5m, Modal Bottom: 2.5m, Modal Silk Dupatta: 2.3m',
  10,
  'published',
  true
),
(
  'DEMO-ORG-05',
  '[DEMO DATA] Pastel Organza Scallop Border Unstitched Suit',
  'demo-pastel-organza-scallop-border-unstitched-suit',
  'Pure sheer organza kurta material with hand-finished cutwork scalloped borders and pastel resham embroidery across the neck and dupatta.',
  4600.00,
  4250.00,
  'Organza',
  'Soft Rani Pink',
  'Scalloped Resham Embroidery',
  'Kurta Fabric: 2.5m, Shantoon Inner/Bottom: 4.0m, Organza Dupatta: 2.25m',
  4,
  'published',
  false
),
(
  'DEMO-LIN-06',
  '[DEMO DATA] Handloom Linen Zari Border Unstitched Suit Material',
  'demo-handloom-linen-zari-border-unstitched-suit-material',
  'Breathable natural handloom linen unstitched suit fabric featuring metallic zari selvedge borders and lightweight coordinated dupatta.',
  2850.00,
  NULL,
  'Linen',
  'Warm Ivory',
  'Zari Border & Slub Weave',
  'Kurta Fabric: 2.5m, Linen Bottom: 2.5m, Linen Dupatta: 2.3m',
  9,
  'published',
  false
)
ON CONFLICT (sku) DO NOTHING;

-- Insert placeholder image references
INSERT INTO public.product_images (product_id, storage_path, public_url, alt_text, display_order)
SELECT id, 'demo/placeholder.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', name, 0
FROM public.products
WHERE sku LIKE 'DEMO-%'
ON CONFLICT DO NOTHING;
