'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

type Invoice = {
  id: string;
  amount: string | number;
  status: 'PAID' | 'REJECTED' | 'PENDING_REVIEW';
  date: string;
  customer: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [status, setStatus] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const fetchData = async (s?: string) => {
    const token = localStorage.getItem('jwt') || '';
    const url = new URL(`${API}/api/invoices`);
    if (s) url.searchParams.set('status', s);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
    const data = await res.json();
    setInvoices(data);
    setCount(data.length);
  };

  useEffect(() => { fetchData(status); }, [status]);
  

  useEffect(() => {
    const socket: Socket = io(API, { transports: ['websocket'] });

    socket.on('invoice.created', () => setCount(c => c + 1));

    // Cleanup function must return void
    return () => {
      socket.disconnect();
      // Explicitly return void
      return undefined;
    };
  }, []);;

  const chartData = useMemo(() => {
    const tally = { PAID: 0, REJECTED: 0, PENDING_REVIEW: 0 };
    invoices.forEach(i => (tally[i.status]++));
    return {
      labels: ['PAID', 'REJECTED', 'PENDING_REVIEW'],
      datasets: [{ data: [tally.PAID, tally.REJECTED, tally.PENDING_REVIEW] }]
    };
  }, [invoices]);

  // useEffect(() => { (window as any).__chartData = chartData; }, [chartData]);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Executive Dashboard</h1>
        <div className="text-sm opacity-80">Live invoices: <span className="font-bold">{count}</span></div>
      </header>

      <section className="flex gap-4 items-center">
        <label>Status filter:</label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="PAID">Paid</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING_REVIEW">Pending Review</option>
        </select>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.id.slice(0,8)}…</td>
                  <td className="p-2">{i.customer}</td>
                  <td className="p-2 text-right">{i.amount}</td>
                  <td className="p-2 text-center">{i.status}</td>
                  <td className="p-2">{new Date(i.date).toLocaleString()}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td className="p-4 text-center opacity-70" colSpan={5}>No invoices</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border rounded p-4">
          {/* Simple donut chart using Chart.js imperatively */}
          <canvas id="statusChart" />
        </div>
      </section>
    </main>
  );
}
