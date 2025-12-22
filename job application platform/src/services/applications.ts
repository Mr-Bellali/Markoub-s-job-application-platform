import api from './api'

// helper to convert File to base64 string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result is like data:application/pdf;base64,AAAA...
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function applyToPosition(positionId: number, fullName: string, email: string, file: File) {
  const fileB64 = await fileToBase64(file)
  const payload = {
    fullName,
    email,
    fileB64,
    fileName: file.name
  }

  const res = await api.post(`/positions/${positionId}/apply`, payload)
  return res.data
}
