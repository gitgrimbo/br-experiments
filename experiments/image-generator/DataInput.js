import React from "react";

export default function DataInput({ data, onChange }) {
  const _onChange = (e) => {
    const idx = Number(e.target.name);
    onChange(idx, e.target.value);
  };
  return (
    <table>
      <tbody>
        {data && data.map(({ id, value }, idx) => (
          <tr key={idx}>
            <td>{id}</td>
            <td><input type="text" name={idx} value={value} onChange={_onChange} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
