input.onButtonPressed(Button.A, function () {
    // Set heat notice to a lower threshold
    heat_notice = 20
})
function logEvent (event: string) {
    lastEvent = event
    lastEventTime = input.runningTime()
}
input.onButtonPressed(Button.AB, function () {
    // Reset earthquake status
    earthquake = 0
    // Reset landslide status
    landslide = 0
    // Confirmation icon
    basic.showIcon(IconNames.Yes)
})
radio.onReceivedString(function (receivedString) {
    basic.clearScreen()
    // Log the received event
    logEvent(receivedString)
    basic.showString("" + (receivedString.toUpperCase()))
    if (receivedString == "enable") {
        // Toggle the enabled status
        enabled = 1 - enabled
    }
})
input.onButtonPressed(Button.B, function () {
    // Set heat notice to a higher threshold
    heat_notice = 40
    // Set fire temperature threshold
    fire_temperature = 20
})
let current_temperature = 0
let landslide = 0
let earthquake = 0
let lastEventTime = 0
let lastEvent = ""
let fire_temperature = 0
let heat_notice = 0
let enabled = 0
enabled = 1
heat_notice = 24
fire_temperature = 49
radio.setGroup(1)
basic.forever(function () {
    if (enabled) {
        current_temperature = input.temperature()
        if (current_temperature > fire_temperature) {
            music.playTone(988, music.beat(BeatFraction.Whole))
            radio.sendString("fire")
            basic.showLeds(`
                . # # # .
                . # . # .
                . # # # .
                . # . # .
                . # . # .
                `)
        } else if (current_temperature > heat_notice) {
            music.playTone(262, music.beat(BeatFraction.Double))
            radio.sendString("heat")
            basic.showLeds(`
                . . . . .
                . # . # .
                # . . . #
                . # . # .
                . . . . .
                `)
        }
        if (input.acceleration(Dimension.X) >= 50 || input.acceleration(Dimension.Z) >= 50) {
            earthquake = 1
            radio.sendString("earthquake")
            basic.showLeds(`
                . # . # .
                # . . . #
                . . # . .
                # . . . #
                . # . # .
                `)
        } else if (input.acceleration(Dimension.X) >= 30 || input.acceleration(Dimension.Y) >= 30) {
            landslide = 1
            radio.sendString("landslide")
            basic.showLeds(`
                # . . . #
                . # . # .
                . . . . .
                . # . # .
                # . . . #
                `)
        }
    }
})
