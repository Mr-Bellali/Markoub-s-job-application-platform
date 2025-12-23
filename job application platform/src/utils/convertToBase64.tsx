function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // remove: "data:application/pdf;base64,"
      resolve(result.split(",")[1])
    }
    reader.onerror = reject
  })
}

export default fileToBase64;