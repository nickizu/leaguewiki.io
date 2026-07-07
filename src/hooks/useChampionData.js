import { useEffect, useState } from 'react'

// Fetches the latest DDragon version, then all champion data for that version.
export default function useChampionData() {
  const [champions, setChampions] = useState(null)
  const [version, setVersion] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const versionResponse = await fetch(
          'https://ddragon.leagueoflegends.com/api/versions.json',
          { headers: { 'Accept-Charset': 'utf-8' } }
        )
        const versionsFile = await versionResponse.json()
        const latestVersion = versionsFile[0]

        const champResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
          { headers: { 'Accept-Charset': 'utf-8' } }
        )
        const champData = await champResponse.json()

        setVersion(latestVersion)
        setChampions(champData.data)
      } catch (err) {
        console.error('Error loading champion data: ', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { champions, version, loading, error }
}
