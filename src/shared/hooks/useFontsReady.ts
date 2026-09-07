import { useEffect, useState } from 'react';

/**
 * Загружены ли веб-шрифты.
 *
 * Нужен кинетической типографике: Split Text анимирует отдельные
 * буквы, и если запустить каскад до готовности Montserrat, буквы
 * выедут системным шрифтом и дёрнутся при подмене. Пока шрифт не
 * готов, буквы просто ждут за краем overflow — скачка не видно.
 */
export const useFontsReady = (): boolean => {
  const [areFontsReady, setAreFontsReady] = useState(
    () => document.fonts?.status === 'loaded',
  );

  useEffect(() => {
    if (areFontsReady || !document.fonts) return;

    let isCancelled = false;
    void document.fonts.ready.then(() => {
      if (!isCancelled) setAreFontsReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, [areFontsReady]);

  return areFontsReady;
};
