"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  FileCheck2,
  Landmark,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { TextInput } from "@/components/ui/TextInput";
import { formatAreaM2, formatKRWShort } from "@/lib/formatters";
import type { Complex } from "@/types/maesucheck";
import type {
  LegalDong,
  PublicApartmentSearchResult,
} from "@/types/public-data";

type HeroSearchProps = {
  basisDate: string;
  complexes: Complex[];
  initialQuery?: string;
  searchTerms: string[];
};

type SearchStatus =
  | "idle"
  | "legal-loading"
  | "legal-ready"
  | "apartments-loading"
  | "apartments-ready"
  | "error";

export function HeroSearch({
  basisDate,
  complexes,
  initialQuery = "",
  searchTerms,
}: HeroSearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [legalDongs, setLegalDongs] = useState<LegalDong[]>([]);
  const [selectedLegalDong, setSelectedLegalDong] = useState<LegalDong | null>(null);
  const [apartments, setApartments] = useState<PublicApartmentSearchResult[]>([]);
  const [complexFilter, setComplexFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const requestId = useRef(0);

  const filteredApartments = useMemo(() => {
    const normalized = normalizeSearchText(complexFilter);
    if (!normalized) return apartments;
    return apartments.filter((item) =>
      normalizeSearchText(item.apartmentName).includes(normalized),
    );
  }, [apartments, complexFilter]);

  async function searchAddress(nextQuery = query): Promise<void> {
    const normalized = nextQuery.trim();
    setQuery(nextQuery);
    if (normalized.length < 2) {
      setErrorMessage("시·군·구와 동 이름을 2자 이상 입력해 주세요.");
      setStatus("error");
      return;
    }

    const currentRequest = ++requestId.current;
    setStatus("legal-loading");
    setErrorMessage("");
    setLegalDongs([]);
    setApartments([]);
    setSelectedLegalDong(null);
    try {
      const response = await fetch(
        `/api/public-data/legal-dongs?q=${encodeURIComponent(normalized)}`,
      );
      const payload = (await response.json()) as {
        items?: LegalDong[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "법정동을 조회하지 못했습니다.");
      if (currentRequest !== requestId.current) return;
      const items = (payload.items ?? []).filter(
        (item) => /^\d{5}$/.test(item.lawdCd) && item.fullName.trim().length > 0,
      );
      setLegalDongs(items.slice(0, 12));
      setStatus("legal-ready");
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setErrorMessage(
        error instanceof Error ? error.message : "법정동을 조회하지 못했습니다.",
      );
      setStatus("error");
    }
  }

  async function selectLegalDong(item: LegalDong): Promise<void> {
    const currentRequest = ++requestId.current;
    setSelectedLegalDong(item);
    setStatus("apartments-loading");
    setApartments([]);
    setComplexFilter("");
    setErrorMessage("");
    const params = new URLSearchParams({
      lawdCd: item.lawdCd,
      dong: item.lowestName,
      fullName: item.fullName,
      months: "6",
    });

    try {
      const response = await fetch(
        `/api/public-data/apartment-complexes?${params.toString()}`,
      );
      const payload = (await response.json()) as {
        items?: PublicApartmentSearchResult[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "실거래 단지를 조회하지 못했습니다.");
      if (currentRequest !== requestId.current) return;
      setApartments(payload.items ?? []);
      setStatus("apartments-ready");
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setErrorMessage(
        error instanceof Error ? error.message : "실거래 단지를 조회하지 못했습니다.",
      );
      setStatus("error");
    }
  }

  const loading = status === "legal-loading" || status === "apartments-loading";

  return (
    <section className="content-shell grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-start lg:py-12">
      <div className="animate-fade-up pt-2 lg:pt-8">
        <Badge className="mb-5" icon={<ShieldCheck size={15} />} variant="primary">
          전국 아파트 실거래 베타 · 기준일 {basisDate}
        </Badge>
        <h1 className="max-w-4xl text-balance text-4xl font-black leading-[1.12] text-foreground md:text-6xl">
          네이버에서 본 그 집,
          <br />
          실제 거래와 내 조건으로
          <br />
          한 번 더 확인하세요
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-text-subtle md:text-lg">
          주소로 법정동을 찾은 뒤 국토교통부 최근 실거래 단지와 면적을 선택합니다.
          비용·세금·규제 리스크는 내 조건 기준으로 이어서 확인할 수 있습니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            onClick={() => document.getElementById("address-search")?.focus()}
            rightIcon={<ArrowRight size={18} />}
            variant="primary"
          >
            실제 주소로 시작하기
          </Button>
          <ButtonLink href="/watchlist" variant="secondary">
            관심단지 보기
          </ButtonLink>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <HeroProof icon={<Landmark size={16} />} label="실거래" value="국토부 공개자료" />
          <HeroProof icon={<Building2 size={16} />} label="비용" value="내 조건별 산정" />
          <HeroProof icon={<FileCheck2 size={16} />} label="근거" value="기준일·면책 포함" />
        </div>
      </div>

      <Surface
        className="animate-fade-up overflow-hidden p-3"
        padding="none"
        radius="xl"
        variant="premium"
      >
        <Surface padding="md" radius="lg" variant="dark">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white/55">실제 단지 검색</div>
              <h2 className="mt-1 text-2xl font-black">주소를 먼저 입력하세요</h2>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12">
              <MapPin size={20} />
            </div>
          </div>
          <form
            className="mt-5 grid grid-cols-[1fr_auto] gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void searchAddress();
            }}
          >
            <TextInput
              id="address-search"
              leftIcon={<Search size={18} />}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 서울 광진구 자양동"
              value={query}
            />
            <Button disabled={loading} type="submit" variant="accent">
              {status === "legal-loading" ? <Loader2 className="animate-spin" size={18} /> : "주소 찾기"}
            </Button>
          </form>
        </Surface>

        <div className="px-2 py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerms.map((term) => (
              <Button
                disabled={loading}
                key={term}
                onClick={() => void searchAddress(term)}
                size="sm"
                variant="ghost"
              >
                {term}
              </Button>
            ))}
          </div>

          {status === "idle" ? (
            <ExampleComplexes complexes={complexes.slice(0, 2)} />
          ) : status === "legal-loading" || status === "apartments-loading" ? (
            <LoadingPanel
              text={
                status === "legal-loading"
                  ? "법정동 주소를 확인하는 중입니다."
                  : `${selectedLegalDong?.fullName ?? "선택 지역"} 최근 6개월 실거래 단지를 찾는 중입니다.`
              }
            />
          ) : status === "error" ? (
            <MessagePanel title="정보를 불러오지 못했습니다" body={errorMessage} tone="error" />
          ) : status === "legal-ready" ? (
            legalDongs.length === 0 ? (
              <MessagePanel
                title="일치하는 법정동이 없습니다"
                body="시·군·구와 동 이름을 함께 입력해 보세요. 예: 서울 광진구 자양동"
              />
            ) : (
              <div className="grid gap-2">
                <div className="px-2 text-xs font-extrabold text-muted">
                  정확한 지역을 선택하세요
                </div>
                {legalDongs.map((item) => (
                  <button
                    className="focus-ring flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/86 px-4 py-3 text-left shadow-[var(--shadow-soft)]"
                    key={item.regionCode}
                    onClick={() => void selectLegalDong(item)}
                    type="button"
                  >
                    <span>
                      <strong className="block text-sm">{item.fullName}</strong>
                      <span className="mt-1 block text-xs text-muted">실거래 지역코드 {item.lawdCd}</span>
                    </span>
                    <ChevronRight className="shrink-0 text-muted" size={18} />
                  </button>
                ))}
              </div>
            )
          ) : (
            <ApartmentResults
              apartments={filteredApartments}
              complexFilter={complexFilter}
              legalDong={selectedLegalDong}
              onFilterChange={setComplexFilter}
            />
          )}
        </div>
      </Surface>
    </section>
  );
}

function ApartmentResults({
  apartments,
  complexFilter,
  legalDong,
  onFilterChange,
}: {
  apartments: PublicApartmentSearchResult[];
  complexFilter: string;
  legalDong: LegalDong | null;
  onFilterChange: (value: string) => void;
}): React.ReactElement {
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl bg-success-soft px-4 py-3">
        <div className="text-xs font-extrabold text-success">선택 지역</div>
        <div className="mt-1 text-sm font-black">{legalDong?.fullName}</div>
      </div>
      <TextInput
        id="complex-filter"
        leftIcon={<Building2 size={17} />}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="조회된 단지명 안에서 찾기"
        value={complexFilter}
      />
      {apartments.length === 0 ? (
        <MessagePanel
          title="최근 실거래 단지를 찾지 못했습니다"
          body="최근 6개월 신고자료에 거래가 없거나 단지명 필터와 일치하지 않습니다. 다른 동을 선택하거나 단지명 필터를 지워보세요."
        />
      ) : (
        <div className="grid max-h-[560px] gap-3 overflow-y-auto pr-1">
          {apartments.slice(0, 40).map((item) => (
            <article
              className="rounded-2xl border border-[var(--border)] bg-white/86 p-4 shadow-[var(--shadow-soft)]"
              key={`${item.apartmentName}-${item.jibun}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black">{item.apartmentName}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {item.dongName} {item.jibun}
                    {item.builtYear ? ` · ${item.builtYear}년` : ""}
                  </p>
                </div>
                <Badge variant="success">매매 {item.tradeCount}건</Badge>
              </div>
              <p className="mt-3 text-xs leading-5 text-text-subtle">
                최근 {item.recentDealDate} · {formatKRWShort(item.recentDealAmountKRW)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.areas.map((area) => (
                  <Link
                    className="focus-ring inline-flex min-h-10 items-center gap-1 rounded-full bg-primary-soft px-3 text-xs font-extrabold text-primary"
                    href={`/complexes/${area.complexId}`}
                    key={area.complexId}
                  >
                    {formatAreaM2(area.areaM2)} · {formatKRWShort(area.recentDealAmountKRW)}
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ExampleComplexes({ complexes }: { complexes: Complex[] }): React.ReactElement {
  return (
    <div className="grid gap-2">
      <div className="px-2 text-xs font-extrabold text-muted">
        주소 검색 전 화면 예시
      </div>
      {complexes.map((complex) => (
        <Link
          className="focus-ring flex min-h-[76px] items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/72 px-4 py-3"
          href={`/complexes/${complex.id}`}
          key={complex.id}
        >
          <span>
            <strong className="block text-sm">{complex.name}</strong>
            <span className="mt-1 block text-xs text-muted">예시 데이터 · 실제 주소 검색을 권장합니다</span>
          </span>
          <ChevronRight className="text-muted" size={18} />
        </Link>
      ))}
    </div>
  );
}

function LoadingPanel({ text }: { text: string }): React.ReactElement {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
      <Loader2 className="animate-spin text-primary" size={28} />
      <p className="max-w-sm text-sm leading-6 text-text-subtle">{text}</p>
    </div>
  );
}

function MessagePanel({
  title,
  body,
  tone = "empty",
}: {
  title: string;
  body: string;
  tone?: "empty" | "error";
}): React.ReactElement {
  return (
    <div className={`rounded-2xl p-5 ${tone === "error" ? "bg-warning-soft" : "bg-surface-muted"}`}>
      <h3 className="text-sm font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-text-subtle">{body}</p>
    </div>
  );
}

function HeroProof({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <Surface padding="md" radius="md" variant="glass">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-primary">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold text-text-subtle">{value}</div>
    </Surface>
  );
}

function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}
