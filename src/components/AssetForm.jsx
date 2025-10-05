import React, { useState } from "react";

const AssetForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: "", name: "", symbol: "", amount_invested: "", date_purchase: "", commission: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ type: "", name: "", symbol: "", amount_invested: "", date_purchase: "", commission: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
      <div className="grid grid-cols-2 gap-2">
        {["type","name","symbol","amount_invested","date_purchase","commission"].map((f) => (
          <input key={f} name={f} value={form[f]} onChange={handleChange} placeholder={f} className="border p-1 rounded" />
        ))}
      </div>
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Добавить актив</button>
    </form>
  );
};

export default AssetForm;
