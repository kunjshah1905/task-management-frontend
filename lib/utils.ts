import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { IRoute } from '@/types/navigation';
import Router from 'next/router';

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== 'undefined';

export const findCurrentRoute = (
  routes: IRoute[],
  pathname: string,
): IRoute | null | undefined => {
  if (!isWindowAvailable()) return null;

  for (let route of routes) {
    if (!!route.items) {
      const found = findCurrentRoute(route.items, pathname);
      if (!!found) return found;
    }
    // console.log("route", route)
    if (pathname?.match(route.path) && route) return route;
  }
};

export const getActiveRoute = (routes: IRoute[], pathname: string): string => {
  const route = findCurrentRoute(routes, pathname);
  return route?.name || "Tasks";
};

export const getActiveNavbar = (
  routes: IRoute[],
  pathname: string,
): boolean | undefined => {
  const route = findCurrentRoute(routes, pathname);
  return route?.secondary;
};

export const getActiveNavbarText = (
  routes: IRoute[],
  pathname: string,
): string | boolean => {
  return getActiveRoute(routes, pathname) || false;
};

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
  if(decimals){
    return Number(value).toFixed(decimals);
  }else{
    return Number(value);
  }
};
