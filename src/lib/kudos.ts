export type Kodu = {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
};

// In-memory store for minimal setup. Replace with DB for production.
const store: Kodu[] = [];

export function createKodu(from: string, to: string, message: string): Kodu {
  const kodu: Kodu = {
    id: crypto.randomUUID(),
    from: from.trim(),
    to: to.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  store.push(kodu);
  return kodu;
}

export function getKodu(id: string): Kodu | undefined {
  return store.find((k) => k.id === id);
}

export function getKoduByTo(to: string): Kodu[] {
  return store.filter((k) => k.to.toLowerCase() === to.toLowerCase()).reverse();
}

export function getAllKodus(): Kodu[] {
  return [...store].reverse();
}
