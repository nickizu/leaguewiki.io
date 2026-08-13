import { useRef, useState } from 'react'
import { Image, Table, Button, Form } from 'react-bootstrap'
import ItemSearchForm from './ItemSearchForm';
import { computeStatsAtLevel } from '../utils/computeStats.js'

function fmt(n, maxDecimals = 2) {
  return Number(n.toFixed(maxDecimals))
}

function ChampionStats({ champion, version, items }) {
  const [level, setLevel] = useState(1)
  const [matches, setMatches] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [doCompare, setDoCompare] = useState(false)

  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`

  const stats = computeStatsAtLevel(champion.stats, level)

  return (
    <div>
      <Image src={imgUrl} alt={champion.name} rounded />
      <br></br>
      <Form.Label>Level: {level}</Form.Label>
      <Form.Range
        min={1}
        max={20}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
      />

      <Table bordered>
        <thead>
          <tr>
            <th colSpan={4}>Stats at level {level}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>HP</th>
            <td>{fmt(stats.hp)}</td>
            <th>MP</th>
            <td>{fmt(stats.mp)}</td>
          </tr>
          <tr>
            <th>HP Regen</th>
            <td>{fmt(stats.hpregen)}</td>
            <th>MP Regen</th>
            <td>{fmt(stats.mpregen)}</td>
          </tr>
          <tr>
            <th>AD</th>
            <td>{fmt(stats.attackdamage, 1)}</td>
            <th>Attack Speed</th>
            <td>{fmt(stats.attackspeed, 3)}</td>
          </tr>
          <tr>
            <th>Armor</th>
            <td>{fmt(stats.armor, 1)}</td>
            <th>MR</th>
            <td>{fmt(stats.spellblock, 1)}</td>
          </tr>
          <tr>
            <th>Range</th>
            <td>{fmt(stats.attackrange)}</td>
            <th>Move Speed</th>
            <td>{fmt(stats.movespeed)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default ChampionStats
