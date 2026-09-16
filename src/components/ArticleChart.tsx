import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Categorical palette for article charts.
 *
 * Slots 1 and 2 are the Axis11 navy and gold; 3 and 4 extend the set. Every
 * pair was checked for colour-vision deficiency separation against both the
 * white card and the cream page (worst-case ΔE 15.8, threshold 8), so hues are
 * assigned in fixed order and never cycled. The content build refuses a fifth
 * series rather than reusing a colour.
 */
const PALETTE = ["#2C63BD", "#A8841F", "#0F9BA8", "#A3274E"] as const;

/** Secondary encoding so series stay separable without relying on colour. */
const DASHES = [undefined, "6 3", "2 3", "10 3 2 3"] as const;

const INK_MUTED = "hsl(215 15% 45%)";
const GRID = "hsl(215 20% 90%)";

export type ChartSeries = {
  key: string;
  label: string;
  color: string | null;
  role: "total" | "category";
};

export type ChartMarker = { x: string; label: string | null };

/**
 * A series that is the sum of the others is drawn as the aggregate, not as a
 * fifth category: brand ink, thicker, always solid. That keeps all four
 * categorical slots free and stops the total reading as a peer of its parts.
 */
const TOTAL_COLOR = "hsl(220 60% 15%)";

export type ChartSpec = {
  xType: "date" | "category";
  yZero: boolean;
  xTicks: string[] | null;
  tickStyle: "month" | "year";
  markers: ChartMarker[];
  type: "line" | "area" | "bar";
  title: string | null;
  subtitle: string | null;
  source: string | null;
  x: string;
  xLabel: string | null;
  yLabel: string | null;
  format: "percent" | "number";
  decimals: number;
  height: number;
  stacked: boolean;
  series: ChartSeries[];
  data: Record<string, string | number | null>[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Axis ticks stay terse ("Mar"); the tooltip spells the day out ("9 Sep 2026"). */
function formatDate(value: unknown, style: "month" | "year" | "full") {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ""));
  if (!match) return String(value ?? "");
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1] ?? month;
  if (style === "year") return year;
  return style === "month" ? name : `${Number(day)} ${name} ${year}`;
}

/**
 * Choose the vertical scale from the data rather than leaving it to recharts,
 * whose automatic domain rounds outward far enough to leave a third of the plot
 * empty. The domain and its ticks are derived together: handing recharts a
 * domain on its own makes it fit ticks inside the bounds and they come out
 * unevenly spaced.
 */
function niceScale(spec: ChartSpec): { domain: [number, number]; ticks: number[] } {
  const values = spec.data.flatMap((row) =>
    spec.series.map((s) => row[s.key]).filter((v): v is number => typeof v === "number"),
  );
  if (values.length === 0) return { domain: [0, 1], ticks: [0, 1] };

  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const range = hi - lo || Math.abs(hi) || 1;

  // Snap the interval to a readable step near a sixth of the range.
  const magnitude = Math.pow(10, Math.floor(Math.log10(range / 6)));
  const step =
    ([1, 2, 2.5, 5, 10].find((m) => m * magnitude >= range / 6) ?? 10) * magnitude;

  const min = Math.floor(lo / step) * step;
  const max = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = min; v <= max + step / 2; v += step) {
    // Re-round each tick: repeated addition of a fractional step drifts.
    ticks.push(Number(v.toPrecision(12)));
  }
  return { domain: [min, max], ticks };
}

/**
 * Categorical hues are assigned in fixed order over the categorical series
 * only, so adding or removing a total never repaints the components.
 */
function makeStyler(series: ChartSeries[]) {
  const slot = new Map<string, number>();
  let next = 0;
  for (const s of series) if (s.role !== "total") slot.set(s.key, next++);
  return (s: ChartSeries) => {
    if (s.role === "total") return { color: s.color ?? TOTAL_COLOR, width: 3, dash: undefined };
    const i = slot.get(s.key) ?? 0;
    return { color: s.color ?? PALETTE[i % PALETTE.length], width: 2, dash: DASHES[i % DASHES.length] };
  };
}

function formatValue(value: unknown, format: ChartSpec["format"], decimals = 1) {
  if (typeof value !== "number") return String(value ?? "");
  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(decimals);
  return format === "percent" ? `${rounded}%` : rounded;
}

function ChartTooltip({
  active,
  payload,
  label,
  format,
  xType,
  decimals,
  totalKey,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; name?: string; value?: number; color?: string }[];
  label?: string | number;
  format: ChartSpec["format"];
  xType: ChartSpec["xType"];
  decimals: number;
  totalKey?: string;
}) {
  if (!active || !payload?.length) return null;
  // The total is the headline figure, so it heads the list even though it is
  // drawn last to keep it on top of the components.
  const rows = totalKey
    ? [...payload].sort(
        (a, b) => Number(String(b.dataKey) === totalKey) - Number(String(a.dataKey) === totalKey),
      )
    : payload;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {xType === "date" ? formatDate(label, "full") : label}
      </p>
      <ul className="space-y-1">
        {rows.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto pl-4 font-medium tabular-nums text-navy">
              {formatValue(entry.value, format, decimals)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Shared axis/grid configuration so all three chart types read as one system.
 *
 * Returned as an array rather than a wrapper component on purpose: recharts
 * identifies axes by inspecting its direct children's component type, so any
 * custom wrapper around them is silently ignored and the chart renders bare.
 */
/**
 * A categorical axis must label every bar, so ticks are never thinned on bar
 * charts. Long category names get angled rather than dropped — which means the
 * plot also needs room on the left for the first label to lean into.
 */
const hasLongLabels = (spec: ChartSpec) =>
  spec.type === "bar" && spec.data.some((row) => String(row[spec.x] ?? "").length > 12);

function frame(spec: ChartSpec) {
  const forceEveryTick = spec.type === "bar";
  const longLabels = hasLongLabels(spec);

  return [
    <CartesianGrid key="grid" stroke={GRID} strokeDasharray="3 3" vertical={false} />,
    <XAxis
      key="x"
      dataKey={spec.x}
      tick={{ fill: INK_MUTED, fontSize: longLabels ? 11 : 12 }}
      tickLine={false}
      axisLine={{ stroke: GRID }}
      ticks={spec.xType === "date" && spec.xTicks ? spec.xTicks : undefined}
      tickFormatter={spec.xType === "date" ? (v: string) => formatDate(v, spec.tickStyle) : undefined}
      interval={spec.xType === "date" ? 0 : forceEveryTick ? 0 : "preserveStartEnd"}
      angle={longLabels ? -20 : 0}
      textAnchor={longLabels ? "end" : "middle"}
      height={longLabels ? 64 : 30}
      dy={longLabels ? 0 : 6}
      label={
        spec.xLabel
          ? { value: spec.xLabel, position: "insideBottom", offset: -12, fill: INK_MUTED, fontSize: 12 }
          : undefined
      }
    />,
    <YAxis
      key="y"
      tick={{ fill: INK_MUTED, fontSize: 12 }}
      tickLine={false}
      axisLine={false}
      width={52}
      // Bars encode magnitude and must sit on zero; a line or area of price
      // levels must not, or the whole series is squashed into a corner of the
      // plot. `yZero: true` forces the baseline back when a chart needs it.
      domain={spec.type === "bar" || spec.yZero ? [0, "auto"] : niceScale(spec).domain}
      ticks={spec.type === "bar" || spec.yZero ? undefined : niceScale(spec).ticks}
      // Axis ticks stay terse; `decimals` raises precision in the tooltip and
      // the data table, where a reader is checking figures rather than scanning.
      tickFormatter={(value: number) => formatValue(value, spec.format)}
      label={
        spec.yLabel
          ? { value: spec.yLabel, angle: -90, position: "insideLeft", fill: INK_MUTED, fontSize: 12 }
          : undefined
      }
    />,
    <Tooltip
      key="tip"
      cursor={{ stroke: INK_MUTED, strokeWidth: 1, strokeDasharray: "3 3" }}
      content={
        <ChartTooltip
          format={spec.format}
          xType={spec.xType}
          decimals={spec.decimals}
          totalKey={spec.series.find((s) => s.role === "total")?.key}
        />
      }
    />,
  ];
}

/**
 * A zero line matters when a series can go negative (contributions, surprises).
 * Returned inline for the same reason as `frame` — recharts only recognises
 * elements it finds directly among the chart's children.
 */
function markerLines(spec: ChartSpec) {
  return spec.markers.map((m) => (
    <ReferenceLine
      key={`marker-${m.x}`}
      x={m.x}
      stroke={INK_MUTED}
      strokeDasharray="4 4"
      label={
        m.label
          ? { value: m.label, position: "insideTopRight", fill: INK_MUTED, fontSize: 11, offset: 8 }
          : undefined
      }
    />
  ));
}

function zeroLine(spec: ChartSpec) {
  const hasNegative = spec.data.some((row) =>
    spec.series.some((s) => typeof row[s.key] === "number" && (row[s.key] as number) < 0),
  );
  return hasNegative ? <ReferenceLine key="zero" y={0} stroke={INK_MUTED} strokeWidth={1.5} /> : null;
}

const STRINGS = {
  en: { show: "Show data", hide: "Hide data", source: "Source" },
  ko: { show: "데이터 보기", hide: "데이터 숨기기", source: "출처" },
} as const;

const ArticleChart = ({ spec, lang = "en" }: { spec: ChartSpec; lang?: string }) => {
  const t = STRINGS[lang as keyof typeof STRINGS] ?? STRINGS.en;
  const { series, data, height, stacked, format } = spec;
  const longLabels = hasLongLabels(spec);
  const styleOf = makeStyler(series);
  const ordered = [...series].sort((a, b) => Number(a.role === "total") - Number(b.role === "total"));
  const margin = {
    top: 8,
    right: longLabels ? 24 : 12,
    bottom: spec.xLabel ? 24 : 8,
    left: longLabels ? 40 : spec.yLabel ? 8 : 0,
  };
  // Angled labels need vertical room that would otherwise squash the plot.
  const plotHeight = longLabels ? height + 40 : height;

  const body = (() => {
    if (spec.type === "bar") {
      return (
        <BarChart data={data} margin={margin} barCategoryGap="22%">
          {frame(spec)}
          {markerLines(spec)}
          {zeroLine(spec)}
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={styleOf(s).color}
              stackId={stacked ? "stack" : undefined}
              radius={stacked ? 0 : [4, 4, 0, 0]}
              // 2px surface gap keeps adjacent and stacked fills from merging.
              stroke="#ffffff"
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      );
    }

    if (spec.type === "area") {
      return (
        <AreaChart data={data} margin={margin}>
          {frame(spec)}
          {markerLines(spec)}
          {zeroLine(spec)}
          {ordered.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stackId={stacked ? "stack" : undefined}
              stroke={styleOf(s).color}
              strokeWidth={styleOf(s).width}
              fill={styleOf(s).color}
              fillOpacity={stacked ? 0.85 : 0.18}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <LineChart data={data} margin={margin}>
        {frame(spec)}
        {markerLines(spec)}
        {zeroLine(spec)}
        {ordered.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={styleOf(s).color}
            strokeWidth={styleOf(s).width}
            strokeDasharray={styleOf(s).dash}
            dot={false}
            connectNulls
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    );
  })();

  return (
    <figure className="my-10 not-prose rounded-lg border border-border bg-card p-5 md:p-6">
      {spec.title && <h4 className="font-heading text-lg font-semibold text-navy">{spec.title}</h4>}
      {spec.subtitle && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{spec.subtitle}</p>}

      {/* Legend sits above the plot so identity is never colour-alone. */}
      {series.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: styleOf(s).color }}
              />
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4" style={{ height: plotHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {body}
        </ResponsiveContainer>
      </div>

      {/* Table fallback: keeps the numbers reachable without colour or hover. */}
      <details className="mt-4 group">
        <summary className="cursor-pointer list-none text-xs font-medium uppercase tracking-widest text-gold-muted hover:text-navy">
          <span className="group-open:hidden">{t.show}</span>
          <span className="hidden group-open:inline">{t.hide}</span>
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-navy">
                  {spec.xLabel ?? spec.x}
                </th>
                {series.map((s) => (
                  <th key={s.key} scope="col" className="py-2 pr-4 text-right font-medium text-navy">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-border/60">
                  <th scope="row" className="py-2 pr-4 text-left font-normal text-muted-foreground">
                    {String(row[spec.x])}
                  </th>
                  {series.map((s) => (
                    <td key={s.key} className="py-2 pr-4 text-right tabular-nums text-navy">
                      {formatValue(row[s.key], format, spec.decimals)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {spec.source && (
        <figcaption className="mt-4 text-xs text-muted-foreground">{t.source}: {spec.source}</figcaption>
      )}
    </figure>
  );
};

export default ArticleChart;
