import { useEffect, useState } from 'react'
import { Table, Form, Row, Col, Image, Button } from 'react-bootstrap'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ChampionSearchForm from './ChampionSearchForm.jsx'
import { computeStatsAtLevel } from '../utils/computeStats.js'
import useRecentPairs from '../hooks/useRecentPairs.js'

function fmt(n, maxDecimals = 2) {
  return Number(n.toFixed(maxDecimals))
}

// Table rows: [label, stat key, decimals]
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

// Stats offered in the graph dropdown (the ones that scale with level).
const GRAPH_STATS = [
  ['HP', 'hp'],
  ['Attack Damage', 'attackdamage'],
  ['Armor', 'armor'],
  ['Magic Resist', 'spellblock'],
  ['Attack Speed', 'attackspeed'],
  ['HP Regen', 'hpregen'],
]

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

function RecentPairPill({ champA, champB, version, onSelect }) {
  const imgA = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champA.image.full}`
  const imgB = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champB.image.full}`
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      className="d-flex align-items-center me-2 mb-2"
      onClick={onSelect}
    >
      <Image src={imgA} alt={champA.name} width={20} height={20} rounded className="me-1" />
      {champA.name}
      <span className="mx-2 text-muted">vs</span>
      <Image src={imgB} alt={champB.name} width={20} height={20} rounded className="me-1" />
      {champB.name}
    </Button>
  )
}

function ChampionCompare({ champions, version, baseChampion }) {
  const [champA, setChampA] = useState(baseChampion ?? null)
  const [champB, setChampB] = useState(null)
  const [level, setLevel] = useState(1)
  const [graphStat, setGraphStat] = useState('hp')
  const [recentPairs, addPair] = useRecentPairs()

  useEffect(() => {
    if (champA && champB) addPair(champA.id, champB.id)
  }, [champA, champB, addPair])

  const resolvedRecentPairs = recentPairs
    .map((pair) => ({ champA: champions?.[pair.a], champB: champions?.[pair.b] }))
    .filter((pair) => pair.champA && pair.champB)

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

  // Build the per-level series (levels 1-20) for the selected graph stat.
  const chartData = bothChosen
    ? Array.from({ length: 20 }, (_, i) => {
        const lvl = i + 1
        return {
          level: lvl,
          a: fmt(computeStatsAtLevel(champA.stats, lvl)[graphStat], 2),
          b: fmt(computeStatsAtLevel(champB.stats, lvl)[graphStat], 2),
        }
      })
    : []

  return (
    <div>
      {resolvedRecentPairs.length > 0 && (
        <div className="mb-3">
          <Form.Label className="d-block">Recent comparisons</Form.Label>
          <div className="d-flex flex-wrap">
            {resolvedRecentPairs.map(({ champA: pairA, champB: pairB }) => (
              <RecentPairPill
                key={`${pairA.id}-${pairB.id}`}
                champA={pairA}
                champB={pairB}
                version={version}
                onSelect={() => {
                  setChampA(pairA)
                  setChampB(pairB)
                }}
              />
            ))}
          </div>
        </div>
      )}

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
        <>
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

          <Form.Label>Graph stat</Form.Label>
          <Form.Select
            className="mb-3"
            value={graphStat}
            onChange={(e) => setGraphStat(e.target.value)}
          >
            {GRAPH_STATS.map(([label, key]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Form.Select>

<div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="level"
                  label={{ value: 'Level', position: 'insideBottom', offset: -15 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="a" name={champA.name} stroke="#2a78d6" dot={false} />
                <Line type="monotone" dataKey="b" name={champB.name} stroke="#eb6834" strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default ChampionCompare