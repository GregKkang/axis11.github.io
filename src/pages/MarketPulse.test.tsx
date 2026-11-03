import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MarketPulse from "./MarketPulse";
import MarketPulseArticle from "./MarketPulseArticle";
import { pulsePosts, pulseUrl } from "@/lib/market-pulse";

afterEach(cleanup);

it("lists the six requested sessions newest first with correctly scaled return gaps", () => {
  render(<MarketPulse />);
  const list = screen.getByRole("list", { name: "Daily market briefings" });
  const rows = within(list).getAllByRole("listitem");
  expect(rows).toHaveLength(6);
  expect(rows[0]).toHaveTextContent("November 2, 2026");
  expect(rows[5]).toHaveTextContent("October 26, 2026");
  expect(rows[0]).toHaveTextContent("−0.51%");
  expect(rows[0]).toHaveTextContent("+0.62%");
  expect(rows[0]).toHaveTextContent("−1.13 pp");
  for (const post of pulsePosts) expect(within(list).getByRole("link", { name: post.title })).toHaveAttribute("href", pulseUrl(post.date));
  expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
});

for (const post of pulsePosts) {
  it(`loads the dated ${post.date} page, tables and method link on direct navigation`, async () => {
    render(<MemoryRouter initialEntries={[`/market-pulse/${post.date}/`]}><Routes><Route path="/market-pulse/:date/" element={<MarketPulseArticle />} /></Routes></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(post.title);
    await screen.findByRole("heading", { name: "How the market response compared with historical patterns" });
    expect(screen.getByRole("heading", { name: "CNBC recap and supporting context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Text used by the model" })).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Method and source notes" })).toHaveAttribute("href", pulseUrl("method"));
    expect(screen.queryByText(/ · Draft/)).not.toBeInTheDocument();
  });
}

it("serves the referenced methodology page", async () => {
  render(<MemoryRouter initialEntries={["/market-pulse/method/"]}><Routes><Route path="/market-pulse/:date/" element={<MarketPulseArticle />} /></Routes></MemoryRouter>);
  await screen.findByRole("heading", { name: "What Market Pulse measures" });
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Model and source notes");
});
