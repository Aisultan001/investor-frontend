import React from "react";

const AssetList = ({ assets, onDelete }) => (
  <div className="mb-4">
    {assets.map(a => (
      <div key={a.id} className="p-2 bg-white mb-1 rounded flex justify-between">
        <div>{a.name} ({a.type}) - {a.amount_invested}</div>
        <button onClick={() => onDelete(a.id)} className="text-red-500">Удалить</button>
      </div>
    ))}
  </div>
);

export default AssetList;
