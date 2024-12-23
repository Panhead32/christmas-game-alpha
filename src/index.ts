import * as _ from "lodash";

import { COUPLES } from "./static/couples";
import { Enums } from "./static/enums";

import { DefinedPlayer, LinkedColor, Player } from "./types/index";

function getExcludedPlayerIds(playerId: number) {
    const findedCouple = COUPLES.find(couple =>
        couple.find(coupleMember => coupleMember.id === playerId)
    )
    if (!findedCouple) return []



    const findedCoupleIds = findedCouple.map(({ id, }) => id)
    const filteredCoupleIds = findedCoupleIds.filter(id => id !== playerId)

    return [...filteredCoupleIds, playerId]
}

function getRandomElements<T = string>(array: T[], count: number = 1) {

    let copyOfArray = [...array];
    const randomlySelectedElements: T[] = [];

    for (let index = 0; index < count; index++) {
        const randomlyChoseElement = _.sample(copyOfArray)!
        randomlySelectedElements.push(randomlyChoseElement)
        const filteredCopyOfArray = copyOfArray.filter(el => randomlyChoseElement !== el)
        copyOfArray = [...filteredCopyOfArray]
    }

    return randomlySelectedElements
}

const allPlayers = COUPLES.reduce<DefinedPlayer[]>((
    acc: DefinedPlayer[],
    couplePlayers: DefinedPlayer[]
) => {
    const [player1, player2] = couplePlayers;
    return [...acc, player1, player2]
}, [])

const formattedAllPlayers = allPlayers.map<Player>((player: DefinedPlayer) => {
    return {
        ...player,
        availableColors: Object.values(Enums.Colors),
        excludedPlayerIds: getExcludedPlayerIds(player.id),
        linkedColors: []
    }
})

for (const playerThatPickColors of formattedAllPlayers) {

    const availablePlayersToChoose = formattedAllPlayers.filter(
        (formattedPlayer) => !playerThatPickColors.excludedPlayerIds.includes(formattedPlayer.id) && formattedPlayer.availableColors.length > 0
    );

    for (const pickedPlayer of availablePlayersToChoose) {

        const twoRandomlyPickedColors = getRandomElements(pickedPlayer.availableColors, 2)

        const linkedColors: LinkedColor[] = [
            ...pickedPlayer.linkedColors,
            ...twoRandomlyPickedColors.map((color) => ({ color, byPlayerId: playerThatPickColors.id }))
        ]

        const availableColors = pickedPlayer.availableColors.filter(color => !twoRandomlyPickedColors.includes(color))

        const updatedPlayer: Player = { ...pickedPlayer, linkedColors, availableColors }
        const updatedPlayerIndexInAllPlayers = formattedAllPlayers.findIndex(el => el.id === updatedPlayer.id)

        formattedAllPlayers.splice(updatedPlayerIndexInAllPlayers, 1, updatedPlayer)
    }

}

const formattedData = formattedAllPlayers.reduce((acc, currentPlayer) => {

    const forWho = formattedAllPlayers.reduce((accumulator: any, player) => {
        const colorsObject = player.linkedColors.filter(el => el.byPlayerId === currentPlayer.id)
        const colorsString = colorsObject.map(el => el.color)
        if (colorsString.length === 0) return accumulator
        if (accumulator?.[player.name]) {
            accumulator[player.name].push(...colorsString)
            return accumulator
        } else {
            return {
                ...accumulator,
                [player.name]: colorsString
            }
        }
    }, {})

    return {
        ...acc,
        [currentPlayer.name]: forWho
    }

}, {})

console.log({ forWho: JSON.stringify(formattedData) });

