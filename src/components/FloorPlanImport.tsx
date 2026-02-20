import { useState } from 'react';
import { FloorPlan, Table, ImportResult } from '../types';
import { parseFloorPlanFile, saveFloorPlan } from '../services/floorPlanParser';
import { validateTablePositions } from '../utils/validation';

interface FloorPlanImportProps {
  locationId: string;
  onImportComplete: (floorPlan: FloorPlan) => void;
  onError: (error: string) => void;
}

export function FloorPlanImport({ locationId, onImportComplete, onError }: FloorPlanImportProps) {
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<FloorPlan | null>(null);

  const handleFileUpload = async (file: File) => {
    setImporting(true);
    try {
      const parsed = await parseFloorPlanFile(file);

      // Validate table positions don't overlap
      const validation = validateTablePositions(parsed.tables);
      if (!validation.valid) {
        onError(`Invalid table positions: ${validation.errors.join(', ')}`);
        return;
      }

      setPreview(parsed);
    } catch (err) {
      onError(`Failed to parse floor plan: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!preview) return;

    setImporting(true);
    try {
      const result = await saveFloorPlan(locationId, preview);
      onImportComplete(result);
    } catch (err) {
      onError(`Failed to save floor plan: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="floor-plan-import">
      <h2>Import Floor Plan</h2>

      <div className="upload-zone">
        <input
          type="file"
          accept=".json,.csv,.xlsx"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          disabled={importing}
        />
        <p>Supported formats: JSON, CSV, Excel</p>
      </div>

      {preview && (
        <div className="preview">
          <h3>Preview</h3>
          <p>{preview.tables.length} tables detected</p>
          <div className="floor-plan-canvas">
            {preview.tables.map(table => (
              <div
                key={table.id}
                className="table-marker"
                style={{
                  left: table.position.x,
                  top: table.position.y,
                  width: table.size.width,
                  height: table.size.height
                }}
              >
                {table.name}
              </div>
            ))}
          </div>
          <button onClick={handleConfirmImport} disabled={importing}>
            {importing ? 'Importing...' : 'Confirm Import'}
          </button>
        </div>
      )}
    </div>
  );
}
