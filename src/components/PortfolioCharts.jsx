import React from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PortfolioCharts = ({ assets }) => {
  const pieData = assets.map(a => ({ name: a.name, value: a.amount_invested }));
  const lineData = assets.map((a,i) => ({ name: a.name, amount: a.amount_invested }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>

      <LineChart width={300} height={300} data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default PortfolioCharts;
