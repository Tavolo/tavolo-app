import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { locations, floorPlans } from '../src/data/mockData';
import { FloorPlan, Table } from '../src/types';

export default function FloorPlans() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const location = locations.find(l => l.id === selectedLocation);
  const floorPlan = location?.floorPlanId ? floorPlans[location.floorPlanId] : null;

  const getTableColor = (table: Table) => {
    const colors: Record<string, string> = {
      Main: 'bg-tavolo-100 border-tavolo-300 hover:bg-tavolo-200',
      Front: 'bg-tavolo-100 border-tavolo-300 hover:bg-tavolo-200',
      Indoor: 'bg-tavolo-100 border-tavolo-300 hover:bg-tavolo-200',
      Private: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      Cabana: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      Window: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      Booth: 'bg-amber-100 border-amber-300 hover:bg-amber-200',
      Center: 'bg-green-100 border-green-300 hover:bg-green-200',
      Bar: 'bg-slate-100 border-slate-300 hover:bg-slate-200',
      Patio: 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200',
      Beach: 'bg-cyan-100 border-cyan-300 hover:bg-cyan-200',
    };
    return colors[table.section] || 'bg-slate-100 border-slate-300 hover:bg-slate-200';
  };

  return (
    <Layout title="Floor Plans">
      <div className="space-y-6">
        {/* Location Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setSelectedTable(null);
            }}
            className="select w-64"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <button className="btn-secondary">
            Import Floor Plan
          </button>

          <button className="btn-secondary">
            Edit Layout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Floor Plan Canvas */}
          <div className="lg:col-span-3 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {floorPlan?.name || 'No Floor Plan'}
              </h2>
              {floorPlan && (
                <span className="text-sm text-slate-500">
                  {floorPlan.tables.length} tables
                </span>
              )}
            </div>

            {floorPlan ? (
              <div
                className="relative bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 overflow-hidden"
                style={{
                  height: Math.min(floorPlan.dimensions.height * 0.8, 500),
                  width: '100%',
                }}
              >
                {floorPlan.tables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`absolute flex items-center justify-center border-2 transition-all cursor-pointer ${
                      getTableColor(table)
                    } ${selectedTable?.id === table.id ? 'ring-2 ring-tavolo-500 ring-offset-2' : ''} ${
                      table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
                    }`}
                    style={{
                      left: table.position.x * 0.8,
                      top: table.position.y * 0.8,
                      width: table.size.width * 0.8,
                      height: table.size.height * 0.8,
                    }}
                  >
                    <span className="text-xs font-medium text-slate-700">{table.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-slate-500 mb-4">No floor plan configured</p>
                  <button className="btn-primary">Import Floor Plan</button>
                </div>
              </div>
            )}

            {/* Legend */}
            {floorPlan && (
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-500">Sections:</span>
                {Array.from(new Set(floorPlan.tables.map(t => t.section))).map(section => (
                  <div key={section} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 ${getTableColor({ section } as Table).split(' ')[0]} ${getTableColor({ section } as Table).split(' ')[1]}`} />
                    <span className="text-sm text-slate-600">{section}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Details Sidebar */}
          <div className="card">
            {selectedTable ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{selectedTable.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-500">Section</label>
                    <p className="font-medium text-slate-900">{selectedTable.section}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">Capacity</label>
                    <p className="font-medium text-slate-900">{selectedTable.capacity} guests</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">Shape</label>
                    <p className="font-medium text-slate-900 capitalize">{selectedTable.shape}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">Dimensions</label>
                    <p className="font-medium text-slate-900">
                      {selectedTable.size.width} x {selectedTable.size.height}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">Position</label>
                    <p className="font-medium text-slate-900">
                      ({selectedTable.position.x}, {selectedTable.position.y})
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <button className="btn-secondary w-full">View Reservations</button>
                    <button className="btn-secondary w-full">Edit Table</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-slate-500">Click a table to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
