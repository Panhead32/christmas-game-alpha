import { Enums } from "../static/enums";

export interface DefinedPlayer {
    id: number;
    name: string
}

export interface LinkedColor {
    byPlayerId: number;
    color: Enums.Colors
}

export interface Player extends DefinedPlayer {
    availableColors: Enums.Colors[];
    excludedPlayerIds: number[];
    linkedColors: LinkedColor[]
}