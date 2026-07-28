import { Image, Table, Button } from 'react-bootstrap'
import { useState } from 'react'
import ItemSearchForm from './ItemSearchForm';

function ChampionStats({ champion, version }) {
  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`
  const [shownItems, setShownItems] = useState([]);

  function handleItemSearch(query) {

  }

  return (
    <div>
      <Image src={imgUrl} alt={champion.name} rounded />
      <p>{champion.blurb}</p>
      <Table bordered>
        <thead>
          <tr>
            <th colSpan={4}>Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>HP</th>
            <td>{champion.stats.hp}</td>
            <th>MP</th>
            <td>{champion.stats.mp}</td>
          </tr>
          <tr>
            <th>Regen</th>
            <td>{champion.stats.hpregen}</td>
            <th>Regen</th>
            <td>{champion.stats.mpregen}</td>
          </tr>
          <tr>
            <th>AD</th>
            <td>{champion.stats.attackdamage}</td>
            <th>AP</th>
            <td>0</td>
          </tr>
          <tr>
            <th>AM</th>
            <td>{champion.stats.armor}</td>
            <th>MR</th>
            <td>{champion.stats.spellblock}</td>
          </tr>
          <tr>
            <th>AR</th>
            <td>{champion.stats.attackrange}</td>
            <th>MS</th>
            <td>{champion.stats.movespeed}</td>
          </tr>
        </tbody>
      </Table>
      {shownItems.map((item, index) => {
        return <ItemSearchForm key={index} onItemSearch={handleItemSearch}></ItemSearchForm>
      })}
      <Button onClick={() => setShownItems((prev) => [...prev, ''])}>Add Item</Button>
    </div>
  )
}

export default ChampionStats
