"use client"
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const Tabela = () => {
  const [teams, setTeams] = useState([]);

  const readTeams = async () => {
    const { data: teamsData, error } = await supabase.from("Equipas").select("*");
    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setTeams(teamsData);
    }
  };

  useEffect(() => {
    readTeams();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mt-16">
        <div className="flex justify-between items-center">
          <h2 className="text-primary">TABELA</h2>
          <div className="text-right">
            <label className="font-bold mr-2 text-primary">TEMPORADA: </label>{" "}
            <select
              name="season"
              id="season"
              className="border rounded px-2 py-1"
            >
              <option>23/24</option>
              <option>22/23</option>
            </select>
          </div>
        </div>
        <hr className="h-px border-0 bg-gray-300 my-6"></hr>
      </div>
      <div className="mt-2">
        <table className="w-full bg-background text-black rounded-lg overflow-hidden">
          <thead className="bg-accent text-text">
            <tr>
              <th className="border-b py-4 pl-4 text-left">POS</th>
              <th className="border-b py-4 cursor-pointer text-left">EQUIPA</th>
              <th className="border-b p-4 cursor-pointer text-center">PJ</th>
              <th className="border-b p-4 cursor-pointer">V</th>
              <th className="border-b p-4 cursor-pointer">E</th>
              <th className="border-b p-4 cursor-pointer">D</th>
              <th className="border-b p-4 cursor-pointer">G</th>
              <th className="border-b p-4 cursor-pointer">DG</th>
              <th className="border-b p-4 cursor-pointer">P</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id}>
                <td className="border-b py-4 pl-4 text-left">{index+1}</td>
                <td className="border-b py-4 text-left">{team.nome_equipa}</td>
                <td className="border-b p-4 text-center">4</td>
                <td className="border-b p-4 text-center">4</td>
                <td className="border-b p-4 text-center">0</td>
                <td className="border-b p-4 text-center">0</td>
                <td className="border-b p-4 text-center">16:2</td>
                <td className="border-b p-4 text-center">14</td>
                <td className="border-b p-4 text-center text-primary font-bold">
                  12
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabela;
