const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3"
const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets"

export async function listSpreadsheets(accessToken: string): Promise<any[]> {
  const response = await fetch(
    `${DRIVE_API_BASE}/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch spreadsheets")
  }

  const data = await response.json()
  return data.files || []
}

export async function getSheetData(accessToken: string, spreadsheetId: string, range = "Sheet1"): Promise<any> {
  const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values/${range}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch sheet data")
  }

  return response.json()
}

export async function updateSheetData(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
): Promise<any> {
  const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values/${range}?valueInputOption=RAW`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  })

  if (!response.ok) {
    throw new Error("Failed to update sheet data")
  }

  return response.json()
}

export async function getSpreadsheetMetadata(accessToken: string, spreadsheetId: string): Promise<any> {
  const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch spreadsheet metadata")
  }

  return response.json()
}
