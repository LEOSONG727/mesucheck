import { describe, expect, it } from "vitest";
import { parseXmlItems } from "@/lib/public-data/xml";

describe("parseXmlItems", () => {
  it("공공데이터 item과 XML entity를 파싱한다", () => {
    const xml = `<?xml version="1.0"?><response><header><resultCode>000</resultCode></header><body><items><item><aptNm>A&amp;B 아파트</aptNm><dealAmount>100,000</dealAmount></item></items></body></response>`;
    expect(parseXmlItems(xml)).toEqual([
      { aptNm: "A&B 아파트", dealAmount: "100,000" },
    ]);
  });

  it("공공데이터 오류 코드를 예외로 처리한다", () => {
    const xml = `<response><header><resultCode>30</resultCode><resultMsg>SERVICE KEY IS NOT REGISTERED</resultMsg></header></response>`;
    expect(() => parseXmlItems(xml)).toThrow("Public API 30");
  });
});
