'use client';

import { AlertCircle, Key, FileText, Info } from 'lucide-react';

interface SpecialInstructionsProps {
  specialInstructions?: string;
  accessNotes?: string;
  notes?: string;
  gateCode?: string;
  compact?: boolean;
}

export default function SpecialInstructions({
  specialInstructions,
  accessNotes,
  notes,
  gateCode,
  compact = false,
}: SpecialInstructionsProps) {
  const hasContent = specialInstructions || accessNotes || notes || gateCode;

  if (!hasContent) return null;

  if (compact) {
    const message = specialInstructions || accessNotes || notes || '';
    return (
      <div className="flex items-start gap-2 p-2 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-sm">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">{message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="w-4 h-4 text-[var(--color-muted-foreground)]" />
        Instructions & Notes
      </div>

      <div className="space-y-2">
        {/* Gate Code */}
        {gateCode && (
          <div className="flex items-center gap-2 p-2 rounded bg-[var(--color-primary)]/10 text-sm">
            <Key className="w-4 h-4 text-[var(--color-primary)]" />
            <span>
              Gate Code: <strong className="font-mono">{gateCode}</strong>
            </span>
          </div>
        )}

        {/* Special Instructions */}
        {specialInstructions && (
          <div className="flex items-start gap-2 p-2 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-0.5">Special Instructions</div>
              <div>{specialInstructions}</div>
            </div>
          </div>
        )}

        {/* Access Notes */}
        {accessNotes && (
          <div className="flex items-start gap-2 p-2 rounded bg-[var(--color-secondary)]/50 text-sm">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-teal)]" />
            <div>
              <div className="font-medium mb-0.5">Access Notes</div>
              <div className="text-[var(--color-muted-foreground)]">{accessNotes}</div>
            </div>
          </div>
        )}

        {/* General Notes */}
        {notes && !specialInstructions && !accessNotes && (
          <div className="flex items-start gap-2 p-2 rounded bg-[var(--color-secondary)]/50 text-sm text-[var(--color-muted-foreground)]">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}

