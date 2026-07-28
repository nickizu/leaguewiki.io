import { useEffect, useState } from 'react'

// Fetches the latest DDragon version, then all champion data for that version.
export default function useItemData(version) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!version) return
    
    async function load() {
      try {
        const itemResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`,
          { headers: { 'Accept-Charset': 'utf-8' } }
        )
        const itemData = await itemResponse.json()

        setItems(itemData.data)
      } catch (err) {
        console.error('Error loading item data: ', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  return { items, loading, error }
}
