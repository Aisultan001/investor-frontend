import { useEffect, useState, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function InvestorApp() {
  const [period, setPeriod] = useState('month');
  const [investments, setInvestments] = useState([
    { id: 1, name: 'ВТБ', amount: 10000, profit: '3.33%', sltp: 'SL 9500 / TP 11000' },
    { id: 2, name: 'Яндекс', amount: 9000, profit: '1.32%', sltp: 'SL 8800 / TP 9500' },
    { id: 3, name: 'Газпром', amount: 6000, profit: '2.35%', sltp: 'SL 5800 / TP 6400' },
    { id: 4, name: 'Сбер', amount: 2000, profit: '1.18%', sltp: 'SL 1900 / TP 2200' },
  ]);

  const tableRef = useRef<HTMLTableElement | null>(null);

  const data = [
    { date: 'Янв', value: 400000 },
    { date: 'Фев', value: 450000 },
    { date: 'Мар', value: 500000 },
    { date: 'Апр', value: 550000 },
  ];

  const totalPortfolio = useMemo(() => investments.reduce((acc, inv) => acc + Number(inv.amount || 0), 0), [investments]);
  const averageProfit = useMemo(() => investments.length ? (investments.reduce((acc, inv) => acc + parseFloat(inv.profit) || 0, 0) / investments.length).toFixed(2) : 0, [investments]);
  const totalProfitValue = useMemo(() => {
    return investments.reduce((acc, inv) => {
      const percent = parseFloat(inv.profit);
      const amount = Number(inv.amount) || 0;
      return acc + (isNaN(percent) ? 0 : amount * (percent / 100));
    }, 0).toFixed(2);
  }, [investments]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      try { tg.setBackgroundColor('#0b0d12'); } catch (e) {}
    }
  }, []);

  const handleCellChange = (rowId: number, field: string, value: string) => {
    setInvestments(prev => prev.map(r => r.id === rowId ? { ...r, [field]: field === 'amount' ? (value === '' ? '' : Number(value)) : value } : r));
  };

  const deleteRow = (id: number) => {
    setInvestments(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white p-4 flex flex-col gap-6 max-w-md mx-auto">

      {/* === Общий портфель === */}
      <Card className="bg-[#121621] border border-[#1e2331] p-4 rounded-2xl shadow-lg">
        <CardContent>
          <h2 className="text-3xl font-bold text-cyan-400 mb-1">₽ {totalPortfolio.toLocaleString()}</h2>
          <p className="text-gray-400 text-sm">Сред. доходность: {averageProfit}%</p>
          <p className="text-gray-400 text-xs">Общая прибыль: ₽ {totalProfitValue}</p>
        </CardContent>
      </Card>

      {/* === Динамика графика === */}
      <Card className="bg-[#121621] border border-[#1e2331] p-4 rounded-2xl shadow-lg">
        <CardContent>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-400 text-sm">Динамика портфеля</h3>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-xl text-xs px-3 py-1 ${period === p ? 'bg-cyan-500 text-black' : 'bg-transparent border border-gray-600 text-gray-400'}`}
                >
                  {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3d" />
              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1b1f2a', borderColor: '#2a2f3d', color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#00ffff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* === Учёт вложений === */}
      <Card className="bg-[#121621] border border-[#1e2331] p-4 rounded-2xl shadow-lg">
        <CardContent>
          <h3 className="text-gray-400 text-sm mb-2">Учёт вложений</h3>
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2f3d] text-gray-400">
                  <th className="py-2">Актив</th>
                  <th className="py-2">Сумма</th>
                  <th className="py-2">Доходность</th>
                  <th className="py-2">SL / TP</th>
                  <th className="py-2 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#2a2f3d] hover:bg-[#1e2331] transition-colors">
                    {['name', 'amount', 'profit', 'sltp'].map((field) => (
                      <td key={field} className="py-2">
                        <input
                          data-excel
                          value={String(inv[field as keyof typeof inv] || '')}
                          onChange={(e) => handleCellChange(inv.id, field, e.target.value)}
                          className="w-full bg-transparent border border-transparent focus:border-cyan-500 rounded px-2 py-1 text-white text-sm"
                        />
                      </td>
                    ))}
                    <td className="py-2 text-right">
                      <button onClick={() => deleteRow(inv.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#2a2f3d] text-gray-300">
                  <td className="py-2 font-semibold">Итого</td>
                  <td className="py-2 font-semibold">₽ {totalPortfolio.toLocaleString()}</td>
                  <td className="py-2 font-semibold">{averageProfit}%</td>
                  <td className="py-2 font-semibold">Прибыль: ₽ {totalProfitValue}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

