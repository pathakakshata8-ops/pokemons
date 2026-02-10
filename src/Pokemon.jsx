import { useEffect, useState, useMemo } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      const detailedResponses = await Promise.all(
        data.results.map(async (curPokemon) => {
          const res = await fetch(curPokemon.url);
          return await res.json();
        })
      );

      setPokemon(detailedResponses);
    } catch (err) {
      console.error(err);
      setError("Failed to load Pokémon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // 🚀 Optimized search (memoized)
  const filteredPokemon = useMemo(() => {
    return pokemon.filter((curPokemon) =>
      curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [pokemon, search]);

  // ✅ Loading UI (FIXED)
  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Pokémon...</h2>
      </div>
    );
  }

  // ✅ Error UI (FIXED)
  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <section className="container">
      <header>
        <h1>Let’s Catch Some Pokémon!</h1>
      </header>

      <div className="pokemon-search">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="cards">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((curPokemon) => (
            <PokemonCards
              key={curPokemon.id}
              pokemonData={curPokemon}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            No Pokémon found 😢
          </p>
        )}
      </ul>
    </section>
  );
};
