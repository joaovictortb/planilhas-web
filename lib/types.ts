export interface GoogleUser {
  email: string
  name: string
  picture: string
  sub: string
}

export interface DriveFile {
  id: string
  name: string
  modifiedTime: string
  mimeType: string
}

export interface SheetData {
  range: string
  values: string[][]
}

export interface SheetStats {
  totalRows: number
  totalColumns: number
  numericColumns: number[]
  columnStats: {
    [key: number]: {
      sum: number
      average: number
      min: number
      max: number
      uniqueValues: number
    }
  }
}
