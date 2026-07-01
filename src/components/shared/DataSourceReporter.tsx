"use client";

import { useEffect } from "react";
import { useDataSource } from "@/lib/store/dataSource";
import type { DataSource } from "@/lib/api/coingecko";

interface DataSourceReporterProps {
  source: DataSource;
}

export function DataSourceReporter({ source }: DataSourceReporterProps) {
  const { setSource } = useDataSource();

  useEffect(() => {
    setSource(source);
  }, [source, setSource]);

  return null;
}
