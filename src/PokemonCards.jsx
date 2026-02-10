import { memo, useMemo } from "react";

const TYPE_COLORS = {
  fire: "#ff6b6b",
  water: "#4dabf7",
  grass: "#51cf66",
  electric: "#ffd43b",
  poison: "#9775fa",
  bug: "#94d82d",
  normal: "#ced4da",
  ground: "#e0c068",
  fairy: "#f783ac",
  fighting: "#e8590c",
  psychic: "#da77f2",
  rock: "#b1976b",
  ghost: "#7950f2",
  ice: "#74c0fc",
  dragon: "#5f3dc4",
};

export const PokemonCards = memo(({ pokemonData }) => {
  if (!pokemonData) return null;

  // 🔹 Cache stats once (performance)
  const stats = useMemo(() => {
    const map = {};
    pokemonData.stats.forEach(
      (s) => (map[s.stat.name] = s.base_stat)
    );
    return map;
  }, [pokemonData.stats]);

  const types = pokemonData.types.map((t) => t.type.name);
  const mainType = types[0];
  const accent = TYPE_COLORS[mainType] || "#2ecc71";

  const image =
    pokemonData.sprites?.other?.dream_world?.front_default ||
    pokemonData.sprites?.front_default ||
    "/placeholder.png";

  return (
    <li
      className="pokemon-card"
      style={{ borderTop: `6px solid ${accent}` }}
    >
      <figure>
        <img
          src={image}
          alt={pokemonData.name}
          className="pokemon-image"
          loading="lazy"
        />
      </figure>

      <h1 className="pokemon-name">{pokemonData.name}</h1>

      {/* Types */}
      <div className="pokemon-info pokemon-highlight">
        <p style={{ backgroundColor: accent }}>
          {types.join(", ")}
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid-three-cols">
        <p className="pokemon-info">
          <span>Height:</span> {pokemonData.height}
        </p>
        <p className="pokemon-info">
          <span>Weight:</span> {pokemonData.weight}
        </p>
        <p className="pokemon-info">
          <span>Speed:</span> {stats.speed}
        </p>
      </div>

      {/* Stats with bars */}
      <div className="grid-three-cols">
        <Stat label="EXP" value={pokemonData.base_experience} color={accent} />
        <Stat label="ATK" value={stats.attack} color={accent} />
        <Stat
          label="Ability"
          value={pokemonData.abilities[0]?.ability.name}
          isText
        />
      </div>
    </li>
  );
});

/* 🔹 Reusable Stat Component */
const Stat = ({ label, value, color, isText }) => {
  if (isText) {
    return (
      <div className="pokemon-info">
        <span>{label}:</span>
        <p style={{ textTransform: "capitalize" }}>{value}</p>
      </div>
    );
  }

  return (
    <div className="pokemon-info">
      <span>{label}:</span>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p>{value}</p>
    </div>
  );
};
