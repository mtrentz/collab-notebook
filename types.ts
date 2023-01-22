export interface UserInfo {
    mouseX: number
    mouseY: number
}

// RoomUsers as array of UserInfo
export interface RoomUsers {
    [key: string]: UserInfo
}