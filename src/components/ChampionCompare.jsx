import { useState } from 'react'
import { Table, Form, Row, Col, Button, Image } from 'react-bootstrap'
import ChampionSearchForm from './ChampionSearchForm.jsx'
import { computeStatsAtLevel } from '../utils/computeStats.js'

function fmt(n, maxDecimals = 2) {
  return Number(n.toFixed(maxDecimals))
}

// Stat rows to compare: [label, stat key, decimals to show]
const STAT_ROWS = [
  ['HP', 'hp', 0],
  ['MP', 'mp', 0],
  ['HP Regen', 'hpregen', 1],
  ['MP Regen', 'mpregen', 1],
  ['AD', 'attackdamage', 1],
  ['Attack Speed', 'attackspeed', 3],
  ['Armor', 'armor', 1],
  ['MR', 'spellblock', 1],
  ['Range', 'attackrange', 0],
  ['Move Speed', 'movespeed', 0],
]

// Green if this value is higher than the other, red if lower, neutral if equal.
function cellClass(value, other) {
  if (value > other) return 'table-success'
  if (value < other) return 'table-danger'
  return ''
}

function ChampionHeader({ champion, version }) {
  if (!champion) return <th>—</th>
  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`
  return (
    <th>
      <Image src={imgUrl} alt={champion.name} width={32} height={32} rounded className="me-2" />
      {champion.name}
    </th>
  )
}

function ChampionPill({ champion, version, onClear }) {
  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`
  return (
    <div className="d-flex align-items-center border rounded p-2">
      <Image src={imgUrl} alt={champion.name} width={32} height={32} rounded className="me-2" />
      <span className="me-auto">{champion.name}</span>
      <Button size="sm" variant="outline-secondary" onClick={onClear}>
        Change
      </Button>
    </div>
  )
}

function ChampionCompare({ champions, version, baseChampion }) {
  const [champA, setChampA] = useState(baseChampion ?? null)
  const [champB, setChampB] = useState(null)
  const [level, setLevel] = useState(1)

  // Enter/Search fallback: select the first champion whose name matches.
  function pickFirst(query, setter) {
    if (!champions || !query) return
    const hit = Object.values(champions).find((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    )
    if (hit) setter(hit)
  }

  const statsA = champA ? computeStatsAtLevel(champA.stats, level) : null
  const statsB = champB ? computeStatsAtLevel(champB.stats, level) : null
  const bothChosen = statsA && statsB

  return (
    <div>
        <Row className="mb-3">
        <Col>
          <Form.Label>Champion 1</Form.Label>
          {champA ? (
            <ChampionPill champion={champA} version={version} onClear={() => setChampA(null)} />
          ) : (
            <ChampionSearchForm
              champions={champions}
              version={version}
              onSelect={setChampA}
              onSearch={(q) => pickFirst(q, setChampA)}
            />
          )}
        </Col>
        <Col>
          <Form.Label>Champion 2</Form.Label>
          {champB ? (
            <ChampionPill champion={champB} version={version} onClear={() => setChampB(null)} />
          ) : (
            <ChampionSearchForm
              champions={champions}
              version={version}
              onSelect={setChampB}
              onSearch={(q) => pickFirst(q, setChampB)}
            />
          )}
        </Col>
      </Row>

      <Form.Label>Level: {level}</Form.Label>
      <Form.Range
        min={1}
        max={20}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
      />

      {!bothChosen && (
        <p className="text-muted mt-3">Pick two champions to compare their stats.</p>
      )}

      {bothChosen && (
        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th>Stat (level {level})</th>
              <ChampionHeader champion={champA} version={version} />
              <ChampionHeader champion={champB} version={version} />
            </tr>
          </thead>
          <tbody>
            {STAT_ROWS.map(([label, key, decimals]) => {
              const a = statsA[key]
              const b = statsB[key]
              return (
                <tr key={key}>
                  <th>{label}</th>
                  <td className={cellClass(a, b)}>{fmt(a, decimals)}</td>
                  <td className={cellClass(b, a)}>{fmt(b, decimals)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default ChampionCompare