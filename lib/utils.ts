import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import Router from 'next/router';

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== 'undefined';

export function firstLetterCapital(letter: string) {
  if (letter != undefined && letter != null && letter != "") {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
  }
}

// FORM UTILS
export function readFilesAsArrayBuffers(files: any) {
  return Promise.all(
    files.map((file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const arrayBuffer = event.target.result;
          resolve(arrayBuffer);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    })
  );
}

// CALCULATION RELATED HELPER FUNCTIONS
export const generateValue = (value: number, decimals?: number) => {
  if (value === 0) {
    return "";
  }
  if (isNaN(value)) {
    return "";
  }
  if (decimals) {
    return Number(value).toFixed(decimals);
  } else {
    return Number(value);
  }
};
