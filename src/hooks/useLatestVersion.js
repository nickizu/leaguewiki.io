import { useEffect, useState } from 'react'

// Fetches the latest DDragon version, then all champion data for that version.
export default function useLatestVersion() {
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
        setVersion(versionsFile[0])
      } catch (err) {
        console.error('Error loading version data: ', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { version, loading, error }
}
