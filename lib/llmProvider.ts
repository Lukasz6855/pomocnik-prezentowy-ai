// Konfiguracja klienta OpenAI dla całej aplikacji
import OpenAI from 'openai';

// Tworzenie instancji klienta OpenAI z kluczem API z zmiennych środowiskowych
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pobieranie nazwy modelu z zmiennych środowiskowych (domyślnie gpt-4o-mini)
export const MODEL_NAME = process.env.LLM_MODEL || 'gpt-4o-mini';

// Eksportowanie skonfigurowanego klienta
export default openai;
