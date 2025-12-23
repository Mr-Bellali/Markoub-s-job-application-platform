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

interface Payload {
  fullName: string;
  email: string;
  fileB64: string;
  fileName: string;
}

export async function applyToPosition(positionId: number, payload: Payload) {
  const res = await api.post(`/positions/${positionId}/apply`, payload)
  return res.data
}
