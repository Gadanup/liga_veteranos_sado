"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { supabase } from "../../lib/supabase";

const Classification = () => {
  const [classification, setClassification] = useState([]);

  const readClassification = async () => {
    const { data: classificationData, error } = await supabase
      .from("league_standings")
      .select(`
        team_id, 
        teams!league_standings_team_id_fkey (short_name, logo_url),
        matches_played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        points
      `);

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setClassification(classificationData);
    }
  };


  useEffect(() => {
    readClassification();
  }, []);

  return (
    <div className=" max-w-6xl">
      <div className="">
        <div className="flex justify-between items-center">
          <h2 className="text-primary">Classificação</h2>
          <div className="text-right">
            <label className="font-bold mr-2 text-primary">Temporada: </label>{" "}
            <select
              name="season"
              id="season"
              className="border rounded px-2 py-1"
            >
              <option>2023/2024</option>
              <option>2022/2023</option>
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
              <th className="border-b p-4 cursor-pointer text-center">J</th>
              <th className="border-b p-4 cursor-pointer">V</th>
              <th className="border-b p-4 cursor-pointer">E</th>
              <th className="border-b p-4 cursor-pointer">D</th>
              <th className="border-b p-4 cursor-pointer">G</th>
              <th className="border-b p-4 cursor-pointer">DG</th>
              <th className="border-b p-4 cursor-pointer">P</th>
            </tr>
          </thead>
          <tbody>
            {classification.map((team, index) => (
              <tr className="odd:bg-transparent even:bg-gray-200" key={team.team_id}>
                <td className="border-b py-4 pl-4 text-left">{index + 1}</td>
                <td className="border-b py-4 text-left">
                  <img src={team.teams.logo_url} alt={`${team.teams.short_name} logo`} className="w-10 h-10 inline-block mr-2" />
                  {team.teams.short_name}</td>
                <td className="border-b p-4 text-center">{team.matches_played}</td>
                <td className="border-b p-4 text-center">{team.wins}</td>
                <td className="border-b p-4 text-center">{team.draws}</td>
                <td className="border-b p-4 text-center">{team.losses}</td>
                <td className="border-b p-4 text-center">
                  {team.goals_for}:{team.goals_against}
                </td>
                <td className={`border-b p-4 text-center font-bold ${team.goals_for - team.goals_against > 0 ? "text-green-500" :
                  team.goals_for - team.goals_against < 0 ? "text-red-500" :
                    "text-gray-500"
                  }`}>{team.goals_for - team.goals_against}</td>
                <td className="border-b p-4 text-center text-primary font-bold">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classification;
