import { useEffect, useRef } from 'react';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  enabled?: boolean;
  minBarcodeLength?: number;
  maxKeyIntervalMs?: number;
}

/**
 * Custom hook to detect 1D/2D desktop USB or Bluetooth barcode scanners
 * operating in HID keyboard emulation mode.
 */
export function useBarcodeScanner({
  onScan,
  enabled = true,
  minBarcodeLength = 3,
  maxKeyIntervalMs = 70,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore functional modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      // Check if target is inside an open modal or editable form field
      const target = e.target as HTMLElement | null;
      const isInsideModal = target ? !!target.closest('[role="dialog"], .z-50') : false;
      if (isInsideModal) {
        // Allow modal fields (like barcode editor input) to receive direct keyboard input
        bufferRef.current = '';
        return;
      }

      const isInputElement =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      const isSearchCatalogInput = target?.id === 'product-catalog-search';

      const now = Date.now();
      const elapsed = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // Handle barcode scanner Enter key (suffix)
      if (e.key === 'Enter') {
        const scannedCode = bufferRef.current.trim();
        bufferRef.current = '';

        if (scannedCode.length >= minBarcodeLength) {
          // If scanner finished, consume the Enter event
          e.preventDefault();
          if (isSearchCatalogInput && target instanceof HTMLInputElement) {
            target.value = '';
          }
          onScanRef.current(scannedCode);
          return;
        }

        // If the user was focused on the search bar and pressed Enter,
        // also check if the search input text matches a barcode
        if (isSearchCatalogInput && target instanceof HTMLInputElement) {
          const val = target.value.trim();
          if (val.length >= minBarcodeLength) {
            onScanRef.current(val);
          }
        }
        return;
      }

      // If typing speed is too slow for a barcode scanner, reset buffer
      // (Scanners emit consecutive keys within 10ms - 50ms)
      if (elapsed > maxKeyIntervalMs) {
        bufferRef.current = '';
      }

      // Only accumulate printable single characters
      if (e.key.length === 1) {
        bufferRef.current += e.key;

        // If an input other than the search bar is focused and the typing is NOT rapid,
        // reset buffer so normal user form typing is not mistaken for a scan
        if (isInputElement && !isSearchCatalogInput && elapsed > maxKeyIntervalMs) {
          bufferRef.current = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled, minBarcodeLength, maxKeyIntervalMs]);
}
