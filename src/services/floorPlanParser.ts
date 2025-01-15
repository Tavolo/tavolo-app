import { FloorPlan, Table, TablePosition, TableSize } from '../types';

/**
 * Parses floor plan files from various formats (JSON, CSV, Excel)
 * and converts them to our internal FloorPlan structure.
 */
export async function parseFloorPlanFile(file: File): Promise<FloorPlan> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'json':
      return parseJsonFloorPlan(file);
    case 'csv':
      return parseCsvFloorPlan(file);
    case 'xlsx':
      return parseExcelFloorPlan(file);
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
}

async function parseJsonFloorPlan(file: File): Promise<FloorPlan> {
  const text = await file.text();
  const data = JSON.parse(text);

  // Support multiple JSON formats
  if (data.tables && Array.isArray(data.tables)) {
    return normalizeFloorPlan(data);
  }

  // OpenTable export format
  if (data.floor_plan && data.floor_plan.sections) {
    return convertOpenTableFormat(data);
  }

  // Resy export format
  if (data.layout && data.layout.tables) {
    return convertResyFormat(data);
  }

  throw new Error('Unrecognized JSON floor plan format');
}

async function parseCsvFloorPlan(file: File): Promise<FloorPlan> {
  const text = await file.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const tables: Table[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => row[h] = values[idx]);

    tables.push({
      id: row.id || `table-${i}`,
      name: row.name || row.table_name || `Table ${i}`,
      capacity: parseInt(row.capacity || row.seats || '4'),
      position: {
        x: parseFloat(row.x || row.pos_x || '0'),
        y: parseFloat(row.y || row.pos_y || '0'),
      },
      size: {
        width: parseFloat(row.width || '60'),
        height: parseFloat(row.height || '60'),
      },
      shape: (row.shape as 'round' | 'square' | 'rectangle') || 'square',
      section: row.section || 'main',
    });
  }

  return {
    id: generateId(),
    name: file.name.replace(/\.[^.]+$/, ''),
    tables,
    dimensions: calculateDimensions(tables),
    createdAt: new Date().toISOString(),
  };
}

async function parseExcelFloorPlan(file: File): Promise<FloorPlan> {
  // In production, use xlsx library
  // For now, throw helpful error
  throw new Error('Excel parsing requires the xlsx library. Please export as CSV or JSON.');
}

function normalizeFloorPlan(data: any): FloorPlan {
  return {
    id: data.id || generateId(),
    name: data.name || 'Imported Floor Plan',
    tables: data.tables.map(normalizeTable),
    dimensions: data.dimensions || calculateDimensions(data.tables),
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function normalizeTable(table: any): Table {
  return {
    id: table.id || generateId(),
    name: table.name || table.label || `Table`,
    capacity: table.capacity || table.seats || table.covers || 4,
    position: {
      x: table.position?.x ?? table.x ?? 0,
      y: table.position?.y ?? table.y ?? 0,
    },
    size: {
      width: table.size?.width ?? table.width ?? 60,
      height: table.size?.height ?? table.height ?? 60,
    },
    shape: table.shape || 'square',
    section: table.section || 'main',
  };
}

function convertOpenTableFormat(data: any): FloorPlan {
  const tables: Table[] = [];

  for (const section of data.floor_plan.sections) {
    for (const table of section.tables) {
      tables.push({
        id: table.table_id,
        name: table.table_number,
        capacity: table.max_covers,
        position: { x: table.x_coord, y: table.y_coord },
        size: { width: table.width || 60, height: table.height || 60 },
        shape: table.shape || 'square',
        section: section.name,
      });
    }
  }

  return {
    id: generateId(),
    name: data.restaurant_name || 'OpenTable Import',
    tables,
    dimensions: calculateDimensions(tables),
    createdAt: new Date().toISOString(),
  };
}

function convertResyFormat(data: any): FloorPlan {
  const tables: Table[] = data.layout.tables.map((t: any) => ({
    id: t.id,
    name: t.display_name,
    capacity: t.party_size_max,
    position: { x: t.coords.left, y: t.coords.top },
    size: { width: t.coords.width, height: t.coords.height },
    shape: t.table_type === 'round' ? 'round' : 'rectangle',
    section: t.section_id,
  }));

  return {
    id: generateId(),
    name: 'Resy Import',
    tables,
    dimensions: calculateDimensions(tables),
    createdAt: new Date().toISOString(),
  };
}

function calculateDimensions(tables: Table[]): { width: number; height: number } {
  if (tables.length === 0) return { width: 800, height: 600 };

  let maxX = 0;
  let maxY = 0;

  for (const table of tables) {
    const right = table.position.x + table.size.width;
    const bottom = table.position.y + table.size.height;
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  }

  return {
    width: Math.max(maxX + 100, 800),
    height: Math.max(maxY + 100, 600),
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
