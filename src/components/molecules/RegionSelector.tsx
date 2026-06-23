"use client";

import { SearchSelect } from "@/components/atoms";
import { REGIONS, getGuList, getDongList } from "@/constants/regions";
import { cn } from "@/utils/cn";

interface RegionSelectorProps {
  city: string;
  gu: string;
  dong: string;
  onCityChange: (v: string) => void;
  onGuChange: (v: string) => void;
  onDongChange: (v: string) => void;
  /** true면 "전체" 옵션 포함 (필터용). false면 없음 (폼용) */
  showAll?: boolean;
  className?: string;
}

const ALL = "전체";
const CITY_LIST = Object.keys(REGIONS);

export default function RegionSelector({
  city, gu, dong,
  onCityChange, onGuChange, onDongChange,
  showAll = false,
  className,
}: RegionSelectorProps) {
  const rawGuList   = getGuList(city !== ALL ? city : "");
  const rawDongList = getDongList(city !== ALL ? city : "", gu !== ALL ? gu : "");

  const cityOptions = showAll ? [ALL, ...CITY_LIST] : CITY_LIST;
  const guOptions   = showAll ? [ALL, ...rawGuList] : rawGuList;
  const dongOptions = showAll ? [ALL, ...rawDongList] : rawDongList;

  const handleCityChange = (v: string) => {
    onCityChange(v);
    onGuChange(showAll ? ALL : "");
    onDongChange(showAll ? ALL : "");
  };

  const handleGuChange = (v: string) => {
    onGuChange(v);
    onDongChange(showAll ? ALL : "");
  };

  const guDisabled   = !showAll && (!city || city === ALL);
  const dongDisabled = !showAll && (!gu   || gu   === ALL);

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <SearchSelect
        value={city}
        onChange={handleCityChange}
        options={cityOptions}
        placeholder={showAll ? "시/도: 전체" : "시/도 선택"}
        className="flex-1 min-w-[130px]"
      />
      <SearchSelect
        value={gu}
        onChange={handleGuChange}
        options={guOptions}
        placeholder={showAll ? "구/군: 전체" : "구/군 선택"}
        disabled={guDisabled}
        className="flex-1 min-w-[120px]"
      />
      <SearchSelect
        value={dong}
        onChange={onDongChange}
        options={dongOptions}
        placeholder={showAll ? "동: 전체" : "동 선택"}
        disabled={dongDisabled}
        className="flex-1 min-w-[110px]"
      />
    </div>
  );
}
