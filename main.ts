enum LoopEvents {
    RESTART = 9999990,
    END     = 9999991
}

enum ActionTypes {
    Chatter  = 8888880,
    Feed     = 8888881,
    Rockabye = 8888882,
}

class Ref<T> {
    current: T;
    constructor(value: T) {
        this.current = value;
    }
}

/**
 * Resets the face to a default smile.
 */
const resetFace = () => {
    // Clear screen
    basic.clearScreen();
    // Plot eyes
    led.plot(1, 1);
    led.plot(3, 1);
    // Plot mouth
    led.plot(1, 3);
    led.plot(2, 4);
    led.plot(3, 3);
}

/**
 * Plays the face and sound crying animation until it finishes, or until it should stop.
 * 
 * @param checkShouldStop checks whether the animation should stop mid-play
 * @returns whether the animation played through fully
 */
const playCryAnimation = (checkShouldStop: () => boolean): boolean => {
    // Clear screen
    basic.clearScreen();
    // Plot closed eyes
    led.plot(0, 1);
    led.plot(1, 1);
    led.plot(3, 1);
    led.plot(4, 1);
    // Plot sad mouth
    led.plot(1, 4);
    led.plot(2, 3);
    led.plot(3, 4);

    basic.pause(music.beat(BeatFraction.Whole));
    if (checkShouldStop()) {
        return false;
    }

    // Start the crying
    const cryMelody = ["g#3:1", "g#4:1", "g#5:2", "g#4:1", "g#5:2", "g#4:3"];
    music.startMelody(cryMelody);
    if (checkShouldStop()) {
        return false;
    }

    // Animate the tears
    const MAX_TIME = 8;
    const MIN_TIME = 0;
    let time = MIN_TIME;
    let tearState = 0;
    while (time <= MAX_TIME) {
        // Animate the tears flowing down face
        led.plotBrightness(0, 2, tearState < MAX_TIME && tearState % 2 === 0 ? 24 : 0);
        led.plotBrightness(4, 2, tearState < MAX_TIME && tearState % 2 === 0 ? 24 : 0);
        led.plotBrightness(0, 3, tearState % 2 === 1 ? 24 : 0);
        led.plotBrightness(4, 3, tearState % 2 === 1 ? 24 : 0);
        led.plotBrightness(0, 4, tearState > MIN_TIME && tearState % 2 === 0 ? 24 : 0);
        led.plotBrightness(4, 4, tearState > MIN_TIME && tearState % 2 === 0 ? 24 : 0);

        // Open mouth for 5 ticks, then close
        if (time % 5 === 0) {
            led.toggle(1, 3);
            led.toggle(2, 4);
            led.toggle(3, 3);
        }

        basic.pause(music.beat(BeatFraction.Half));
        if (checkShouldStop()) {
            return false;
        }

        time++;
        tearState++;
    }

    return true;
};

/**
 * Plays the face and sound animation for when the user successfully
 * calms the baby down.
 */
const playSuccessAnimation = () => {
    resetFace();
    music.startMelody(['c3:2', 'c4:2', 'c5:4'])
    basic.pause(music.beat(BeatFraction.Quarter) * 12);
    music.stopMelody(MelodyStopOptions.All);
};

/**
 * Plays the face and sound animation for when the baby is sleeping.
 */
const playSleepingAnimation = () => {
    // Clear screen
    basic.clearScreen();
    // Plot closed eyes
    led.plot(0, 1);
    led.plot(1, 1);
    led.plot(3, 1);
    led.plot(4, 1);

    // Draws the mouth at resting position
    const drawRestMouth = () => {
        led.plot(1, 3);
        led.plot(2, 3);
        led.plot(3, 3);

        led.unplot(2, 4);
        led.unplot(1, 4);
        led.unplot(3, 4);
    }

    // Draws the mouth inhaling
    const drawInhaleMouth = () => {
        led.plot(1, 3);
        led.plot(2, 3);
        led.plot(3, 3);
        led.plot(1, 4);
        led.plot(2, 4);
        led.plot(3, 4);
    }

    // Draws the mouth exhaling
    const drawExhaleMouth = () => {
        led.plot(2, 3);

        led.unplot(2, 4);
        led.unplot(1, 3);
        led.unplot(3, 3);
        led.unplot(1, 4);
        led.unplot(3, 4);
    }

    // Start snoozing 3 times
    for (let i = 0; i < 3; i++) {
        drawRestMouth();
        basic.pause(music.beat(BeatFraction.Quarter) * 4);
        drawInhaleMouth();
        music.playTone(Note.C4, music.beat(BeatFraction.Quarter) * 6);
        drawRestMouth();
        basic.pause(music.beat(BeatFraction.Quarter) * 4);
        drawExhaleMouth();
        music.playTone(Note.C3, music.beat(BeatFraction.Quarter) * 6);
    }
    // End on a smile
    drawRestMouth();
    basic.pause(music.beat(BeatFraction.Quarter) * 4);
};

/**
 * Plays the face and sound animation when the baby starts to scream.
 */
const playTantrumAnimation = () => {
    // Clear screen
    basic.clearScreen();

    // Plot closed eyes
    led.plot(1, 1);
    led.plot(0, 1);
    led.plot(3, 1);
    led.plot(4, 1);

    // Plot mouth
    led.plot(1, 3);
    led.plot(2, 3);
    led.plot(3, 3);
    led.plot(1, 4);
    led.plot(2, 4);
    led.plot(3, 4);

    // Plot tears
    led.plotBrightness(0, 2, 12);
    led.plotBrightness(4, 2, 12);
    led.plotBrightness(0, 3, 12);
    led.plotBrightness(4, 3, 12);
    led.plotBrightness(0, 4, 12);
    led.plotBrightness(4, 4, 12);

    // Play screaming tone
    music.playTone(Note.GSharp5, music.beat() * 3)
};

/**
 * Plays the face and sound animation when the baby faints.
 */
const playFaintAnimation = () => {
    // Clear screen
    basic.clearScreen();
    // Plot closed eyes
    led.plot(1, 1);
    led.plot(0, 1);
    led.plot(3, 1);
    led.plot(4, 1);
    // Plot mouth
    led.plot(0, 4);
    led.plot(1, 4);
    led.plot(2, 4);
    led.plot(3, 4);
    led.plot(4, 4);

    // Play faint melody
    music.startMelody(['c3:2', 'c2:4'])
    basic.pause(music.beat(BeatFraction.Quarter) * 6);
    music.stopMelody(MelodyStopOptions.All);
};

/**
 * Input even handler for rocking the micro:bit. After four rocks (left, right, left, right),
 * the passed event handler callback will be called.
 * 
 * @param onInput the event handler for when the rockabye is completed
 */
const inputOnRockabye = (onInput: () => void) => {
    const rockabye = new Ref(0);
    const firstRock = new Ref<'left' | 'right' | null>(null);

    input.onGesture(Gesture.TiltLeft, () => {
        if (rockabye.current === 0) {
            firstRock.current = 'left';
            rockabye.current++;
        } else if (firstRock.current === 'right' && rockabye.current % 2 === 1) {
            rockabye.current++;
        } else if (firstRock.current === 'left' && rockabye.current % 2 === 0) {
            rockabye.current++;
        }

        // After four rocks, call the event handler function
        if (rockabye.current >= 4) {
            onInput();
        }
    });

    input.onGesture(Gesture.TiltRight, () => {
        if (rockabye.current === 0) {
            firstRock.current = 'right';
            rockabye.current++;
        } else if (firstRock.current === 'left' && rockabye.current % 2 === 1) {
            rockabye.current++;
        } else if (firstRock.current === 'right' && rockabye.current % 2 === 0) {
            rockabye.current++;
        }

        // After four rocks, call the event handler function
        if (rockabye.current >= 4) {
            onInput();
        }
    });
};

/**
 * Attaches the sound, button, and rockabye event handlers to the given
 * callback function.
 */
const attachEventHandlers = (onAction: (action: ActionTypes) => void) => {
    // When talk to baby, baby will laugh
    input.onSound(DetectedSound.Loud, function () {
        onAction(ActionTypes.Chatter);
    });

    // When belly button pressed, feed baby
    input.onPinPressed(TouchPin.P0, () => {
        onAction(ActionTypes.Feed);
    });
    
    // When rocked, put baby to sleep
    inputOnRockabye(() => {
        onAction(ActionTypes.Rockabye);
    });
}

/**
 * Performs a single, complete loop of the game.
 */
const loop = () => {
    const hasFainted = new Ref(false);

    // While not fainted...
    while (!hasFainted.current) {
        const hasLoopEnded = new Ref(false);

        // Reset face
        resetFace();

        // Wait a random amount of time before next action
        basic.pause(randint(7, 10) * 1000);
        
        // Determine what the next action must be to calm the baby
        const actionTypes = [
            ActionTypes.Chatter, 
            ActionTypes.Feed, 
            ActionTypes.Rockabye,
        ];
        const nextAction = actionTypes[randint(0, actionTypes.length - 1)];

        // Wait for action to end loop
        attachEventHandlers(action => {
            console.log(`attempt ${action}`);
            // Each action will attempt to solve loop, but only one value will be correct!
            control.raiseEvent(LoopEvents.END, action);
        });

        // Play face action in background until loop ends, or until baby faints
        control.inBackground(() => {
            const MAX_CYCLES_UNTIL_FAINT = 3;
            let cycles = 0;
            
            while (cycles < MAX_CYCLES_UNTIL_FAINT && !hasLoopEnded.current) {
                const didAnimationFinish = playCryAnimation(() => hasLoopEnded.current);
                if (didAnimationFinish) {
                    cycles++;
                }
            }

            if (cycles === MAX_CYCLES_UNTIL_FAINT) {
                hasFainted.current = true;
                control.raiseEvent(LoopEvents.END, nextAction);
            }
        });

        // When event is captured, end loop
        control.waitForEvent(LoopEvents.END, nextAction)
        hasLoopEnded.current = true;
        music.stopMelody(MelodyStopOptions.All);

        // if baby hasn't fainted, play calming melody + face
        if (!hasFainted.current) {
            playSuccessAnimation();
            playSleepingAnimation();
        }
    }

    // When baby is not calmed down...
    playTantrumAnimation();
    playFaintAnimation();
}

/**
 * Runs the full game, including shake-to-reset.
 */
const runGame = () => {
    music.setVolume(63);
    
    while (true) {
        input.onGesture(Gesture.Shake, () => {
            control.raiseEvent(LoopEvents.RESTART, 0);
        });
        control.waitForEvent(LoopEvents.RESTART, 0);
        loop();
    }
}

runGame();