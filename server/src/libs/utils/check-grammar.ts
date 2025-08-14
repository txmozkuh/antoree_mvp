export const checkGrammar = async (content: string) => {
  const response = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      text: content,
      language: 'en-US'
    })
  })

  const result = await response.json()

  return result.matches.map((item: never) => {
    const { message, offset, length, replacements } = item
    return { message, offset, length, replacements }
  })
}
