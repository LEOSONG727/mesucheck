const XML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
};

export function parseXmlItems(xml: string): Array<Record<string, string>> {
  const resultCode = readXmlTag(xml, "resultCode");
  if (resultCode && resultCode !== "000" && resultCode !== "00") {
    const message = readXmlTag(xml, "resultMsg") || "공공데이터 API 오류";
    throw new Error(`Public API ${resultCode}: ${message}`);
  }

  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g), ([, item]) => {
    const values: Record<string, string> = {};
    for (const match of item.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      values[match[1]] = decodeXml(match[2]).trim();
    }
    return values;
  });
}
export function readXmlTag(xml: string, tag: string): string | undefined {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escaped}>([\\s\\S]*?)<\\/${escaped}>`));
  return match ? decodeXml(match[1]).trim() : undefined;
}

function decodeXml(value: string): string {
  return value.replace(/&(#x?[0-9A-Fa-f]+|[A-Za-z]+);/g, (entity, code: string) => {
    if (code.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return XML_ENTITIES[code] ?? entity;
  });
}
