import React, { useState, useEffect } from "react";
import AssetForm from "./components/AssetForm";
import AssetList from "./components/AssetList";
import PortfolioCharts from "./components/PortfolioCharts";
import { fetchAssets, addAsset, deleteAsset } from "./api";

const App = () => {
  const [assets, setAssets] = useState([]);
  const [token, setToken] = useState("demo-token"); // Здесь вставь токен из backend

  const loadAssets = async () => {
    const data = await fetchAssets(token);
    setAssets(data);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleAdd = async (asset) => {
    await addAsset(asset, token);
    loadAssets();
  };

  const handleDelete = async (id) => {
    await deleteAsset(id, token);
    loadAssets();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Мой портфель</h1>
      <AssetForm onAdd={handleAdd} />
      <AssetList assets={assets} onDelete={handleDelete} />
      <PortfolioCharts assets={assets} />
    </div>
  );
};

export default App;
