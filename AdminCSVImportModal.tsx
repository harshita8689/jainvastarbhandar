import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { csvService, type ImportSummary } from '../services/csvService';
import type { ValidatedCSVRow } from '../types';

interface AdminCSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminCSVImportModal: React.FC<AdminCSVImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ValidatedCSVRow[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrorBanner('Please select a valid .csv file.');
      return;
    }

    setFile(selectedFile);
    setErrorBanner(null);
    setImportSummary(null);
    setIsValidating(true);

    try {
      // 1. Parse CSV
      const rawRows = await csvService.parseCSVFile(selectedFile);
      if (rawRows.length === 0) {
        setErrorBanner('The selected CSV file has no product rows.');
        setIsValidating(false);
        return;
      }

      // 2. Fetch existing SKUs from database to detect duplicates
      const existingSkusInDb = await csvService.getExistingSKUs();

      // 3. Validate rows
      const validated = csvService.validateRows(rawRows, existingSkusInDb);
      setParsedRows(validated);
      setIsValidating(false);
    } catch (err: any) {
      setErrorBanner(err?.message || 'Failed to parse CSV file');
      setIsValidating(false);
    }
  };

  const handleStartImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setErrorBanner('No valid rows found to import. Please correct errors and re-upload.');
      return;
    }

    setIsImporting(true);
    setErrorBanner(null);
    setProgress({ done: 0, total: validRows.length });

    try {
      const summary = await csvService.importRows(parsedRows, (done, total) => {
        setProgress({ done, total });
      });

      setImportSummary(summary);
      setIsImporting(false);
      if (summary.succeeded > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorBanner(err?.message || 'Import failed');
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setParsedRows([]);
    setImportSummary(null);
    setErrorBanner(null);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-jvb-wine-900 text-white flex items-center justify-between border-b border-jvb-wine-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-jvb-wine-800 text-pink-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Bulk Product Import from CSV
              </h2>
              <p className="text-xs text-pink-200">
                Easily import 100–200 unstitched suits with automatic SKU validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-jvb-wine-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Templates Download Prompt */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-700">
              <strong className="text-gray-900 block mb-0.5">Need a CSV template?</strong>
              Download our blank template formatted for Excel and Google Sheets with all required columns.
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="/templates/jvb_product_import_blank_template.csv"
                download="jvb_product_import_blank_template.csv"
                className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-3 py-2 rounded-lg shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-jvb-pink-600" />
                <span>Blank CSV Template</span>
              </a>
              <a
                href="/templates/jvb_product_import_sample.csv"
                download="jvb_product_import_sample.csv"
                className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-3 py-2 rounded-lg shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-jvb-wine-700" />
                <span>Sample Demo CSV</span>
              </a>
            </div>
          </div>

          {errorBanner && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{errorBanner}</span>
            </div>
          )}

          {/* Import Summary Results if finished */}
          {importSummary && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Import Finished!</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <div className="text-xl font-bold text-gray-800">{importSummary.total}</div>
                  <div className="text-[11px] text-gray-500">Attempted</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <div className="text-xl font-bold text-emerald-700">{importSummary.succeeded}</div>
                  <div className="text-[11px] text-gray-500">Succeeded</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <div className="text-xl font-bold text-red-600">{importSummary.failed}</div>
                  <div className="text-[11px] text-gray-500">Failed</div>
                </div>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-red-800 mb-1">Failed Rows:</h4>
                  <ul className="text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                    {importSummary.errors.map((err, i) => (
                      <li key={i}>
                        Row {err.row} (SKU: {err.sku}): {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Upload Drop Zone if no file parsed */}
          {!file && (
            <label className="border-2 border-dashed border-gray-300 hover:border-jvb-pink-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-pink-50/20 transition-all">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="font-semibold text-sm text-gray-800">
                Choose CSV file to import products
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Supports .csv files with UTF-8 encoding
              </span>
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
            </label>
          )}

          {/* Validation in progress */}
          {isValidating && (
            <div className="text-center py-10 space-y-3">
              <Loader2 className="w-8 h-8 text-jvb-pink-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-gray-700">
                Parsing and validating rows against database...
              </p>
            </div>
          )}

          {/* Parsed Rows Preview */}
          {!isValidating && parsedRows.length > 0 && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-100 p-3 rounded-xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">
                    File: <code className="bg-white px-1.5 py-0.5 rounded">{file?.name}</code>
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validCount} Valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-red-800 font-semibold bg-red-100 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {invalidCount} Invalid
                    </span>
                  )}
                </div>

                <button
                  onClick={resetImport}
                  className="text-xs text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Choose Another File</span>
                </button>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold sticky top-0 text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Row</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Fabric</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={row.isValid ? 'hover:bg-gray-50' : 'bg-red-50/50'}
                      >
                        <td className="py-2 px-3 font-mono text-gray-500">{row.rowNumber}</td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="text-emerald-700 font-semibold">Valid</span>
                          ) : (
                            <span
                              className="text-red-700 font-semibold"
                              title={row.errors.join('; ')}
                            >
                              Invalid ({row.errors[0]})
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold">{row.data.sku}</td>
                        <td className="py-2 px-3 truncate max-w-[200px]">{row.data.name}</td>
                        <td className="py-2 px-3">{row.data.fabric_type}</td>
                        <td className="py-2 px-3 font-semibold">₹{row.data.price}</td>
                        <td className="py-2 px-3">{row.data.stock_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress bar during live import */}
              {isImporting && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                    <span>Importing into Supabase...</span>
                    <span>
                      {progress.done} of {progress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-jvb-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white"
          >
            Close
          </button>

          {parsedRows.length > 0 && !importSummary && (
            <button
              type="button"
              onClick={handleStartImport}
              disabled={isImporting || validCount === 0}
              className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing {progress.done}/{progress.total}...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Import {validCount} Valid Suits</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
