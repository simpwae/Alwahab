import React, { useState, useRef } from 'react';
import {
  UploadCloudIcon,
  CopyIcon,
  CheckIcon,
  ImageIcon,
  XIcon } from
'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
interface BankTransferPanelProps {
  receiptFile: File | null;
  onReceiptChange: (file: File | null) => void;
  error?: string;
}
function CopyableRow({ label, value }: {label: string;value: string;}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-ink-muted transition-colors hover:border-primary hover:text-primary">
        
        {copied ?
        <CheckIcon className="h-3.5 w-3.5 text-primary" /> :

        <CopyIcon className="h-3.5 w-3.5" />
        }
      </button>
    </div>);

}
export function BankTransferPanel({
  receiptFile,
  onReceiptChange,
  error
}: BankTransferPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useStoreSettings();
  const { bankName, accountTitle, accountNumber, iban, branchCode } =
  settings.bankTransfer;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onReceiptChange(file);
  };
  return (
    <div className="mt-4 space-y-4 rounded-xl bg-surface p-4">
      <div>
        <h4 className="text-sm font-semibold text-ink">
          Alwahab Bank Account Details
        </h4>
        <div className="mt-1 divide-y divide-gray-200">
          <CopyableRow label="Bank Name" value={bankName} />
          <CopyableRow label="Account Title" value={accountTitle} />
          <CopyableRow label="Account Number" value={accountNumber} />
          <CopyableRow label="IBAN" value={iban} />
          <CopyableRow label="Branch Code" value={branchCode} />
        </div>
      </div>

      <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800">
        Pay the total amount, screenshot your receipt, and upload it below. Your
        order will be marked &ldquo;Payment Pending — Awaiting
        Verification&rdquo; until our team confirms your payment.
      </p>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Upload Payment Receipt
        </label>
        {receiptFile ?
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-sm text-ink">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{receiptFile.name}</span>
            </span>
            <button
            type="button"
            onClick={() => onReceiptChange(null)}
            aria-label="Remove receipt"
            className="rounded-full p-1 text-ink-muted hover:bg-gray-100 hover:text-red-600">
            
              <XIcon className="h-4 w-4" />
            </button>
          </div> :

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-primary'}`}>
          
            <UploadCloudIcon className="h-6 w-6 text-ink-muted" />
            <span className="text-sm font-medium text-ink">
              Click to upload receipt
            </span>
            <span className="text-xs text-ink-muted">
              PNG or JPG, up to 5MB
            </span>
          </button>
        }
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload payment receipt" />
        
        {error &&
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
        }
      </div>
    </div>);

}