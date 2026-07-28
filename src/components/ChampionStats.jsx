import { useRef, useState } from 'react'
import { Image, Table, Button, Form } from 'react-bootstrap'
import ItemSearchForm from './ItemSearchForm';
import { computeStatsAtLevel } from '../utils/computeStats.js'

function fmt(n, maxDecimals = 2) {
  return Number(n.toFixed(maxDecimals))
}

function ChampionStats({ champion, version, items }) {
  const [level, setLevel] = useState(1)
  const [shownItems, setShownItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [matches, setMatches] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [doCompare, setDoCompare] = useState(false)

  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`

  const nextId = useRef(0)

  function handleItemSearch(query) {
    setSelectedItem(null)
    setMatches(null)
    setNotFound(false)

    if (!items || !query) return

    const results = Object.values(items).filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )

    if (results.length === 0) {
      setNotFound(true)
    } else if (results.length > 1) {
      setMatches(results)
    } else {
      setSelectedItem(results[0])
    }
  }

  function handleItemSelect(item) {
    setMatches(null)
    setNotFound(false)
    setSelectedItem(item)
  }

  function handleItemRemove(id) {
    setShownItems((prev) => prev.filter((item) => item.id !== id))
  }
  
  const stats = computeStatsAtLevel(champion.stats, level)

  return (
    <div>
      <Image src={imgUrl} alt={champion.name} rounded />
      <p>{champion.blurb}</p>

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
      {shownItems.map((item) => {
        return <ItemSearchForm items={items} version={version} key={item.id} itemNum={item.id} onSearch={handleItemSearch} onSelect={handleItemSelect} onItemRemove={handleItemRemove}></ItemSearchForm>
      })}
      <Button onClick={() => setShownItems((prev) => [...prev, { id: nextId.current++, value: ''}])}>Add Item</Button>
    </div>
  )
}

export default ChampionStats
