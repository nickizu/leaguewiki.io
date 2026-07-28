/*  This is used to calculate stats for a champion at a given level.
    The general formula is:
        value(level) = base + growth * (level - 1) * (0.7025 + 0.0175 * (level-1))
*/

const grConstA = .7025
const grConstB = .0175
const maxLevel = 20

function growthFactor(level) {
  const n = Math.min(level, maxLevel) - 1
  return n * (grConstA + grConstB * n)
}

export function computeStatAtLevel(level, base, growth) {
  return base + growth * growthFactor(level)
}

export function computeStatsAtLevel(stats, level) {
  const factor = growthFactor(level)
  return {
    movespeed: stats.movespeed,     // flat
    attackrange: stats.attackrange, // flat
    hp: stats.hp + stats.hpperlevel * factor,
    mp: stats.mp + stats.mpperlevel * factor,
    armor: stats.armor + stats.armorperlevel * factor,
    spellblock: stats.spellblock + stats.spellblockperlevel * factor,
    attackdamage: stats.attackdamage + stats.attackdamageperlevel * factor,
    hpregen: stats.hpregen + stats.hpregenperlevel * factor,
    mpregen: stats.mpregen + stats.mpregenperlevel * factor,
    crit: stats.crit + stats.critperlevel * factor,
    attackspeed: stats.attackspeed * (1 + (stats.attackspeedperlevel * factor) / 100),
  }
}