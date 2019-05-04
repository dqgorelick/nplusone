// $(document).ready(function() {
    var COMBO = 'combo'
    var PULSE = 'PULSE';
    var LINE = 'LINE';
    var STROBE = 'STROBE';
    var STROBE2 = 'STROBE2';
    var VARIABLE_TIME = 'VARIABLE_TIME';
    var VARIABLE_LINES = 'VARIABLE_LINES';
    var SEQUENCE = 'SEQUENCE';
    var MODES = [COMBO, PULSE, LINE, STROBE, STROBE2, SEQUENCE];
    // var ACTIVE_MODES = [VARIABLE_LINES, VARIABLE_TIME];
    var ACTIVE_MODES = [VARIABLE_TIME,VARIABLE_LINES];
    var MODE = VARIABLE_TIME;

    var INTERACTIVE = false;
    var PATH_NUMBER = 8;

    var urlParams = new URLSearchParams(window.location.search);
    var mode = urlParams.get('mode');
    if (mode) {
        switch (mode) {
            case 'live':
                MODE = SEQUENCE;
                break;
            case 'changing':
                MODE = VARIABLE_TIME;
                break;
            case 'lines':
                MODE = VARIABLE_LINES;
                break;
            case 'combo':
                MODE = COMBO;
                break;
            case 'pulse':
                MODE = PULSE;
                break;
            case 'line':
                MODE = LINE;
                break;
            case 'strobe':
                MODE = STROBE;
                break;
            case 'strobe2':
                MODE = STROBE2;
                break;
            default:
                break;
        }
    }

    console.log('MODE', MODE);

    var active = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
    var initialActive = active;

    function pickInactivePath() {
        var pathNumber = Math.ceil(Math.random() * PATH_NUMBER);
        tryCount = 0;
        while (active[pathNumber]) {
            pathNumber = Math.ceil(Math.random() * PATH_NUMBER);
            tryCount++;
            if (tryCount === PATH_NUMBER) {
                console.log('no more inactive paths');
                return;
            }
        }
        active[pathNumber] = true;
        return pathNumber;
    }

    function clearActivePath(pathNumber) {
        active[pathNumber] = false;
    }

    function triggerAnimation(pathNumber, className) {
        var path = $('.shape-' + pathNumber);
        path.addClass(className);
        path.on('animationiteration webkitAnimationIteration oanimationiteration MSAnimationIteration', function(e) {
            $(this).removeClass(className);
            clearActivePath(pathNumber);
        });
    }

    function triggerAnimationLine(pathNumber, className) {
        var path = $('.shape-' + pathNumber);
        path.addClass(className);
        path.on('animationiteration webkitAnimationIteration oanimationiteration MSAnimationIteration', function(e) {
            path.off();
            $(this).removeClass(className);
            clearActivePath(pathNumber);
            addAnimationLine();
        });
    }

    function addAnimationLine() {
        var pathNumber = pickInactivePath();
        var className = 'animating-' + pathNumber;
        triggerAnimationLine(pathNumber, className);
    };

    function getStripeType(number) {
        switch (number) {
            case -1:
                return 'diag-thick';
            case 0:
                return 'diag-left';
            case 1:
                return 'diag-right';
            case 2:
                return 'horizontal';
            case 3:
                return 'vertical';
        }
    }

    var stripeType = 0;

    function addAnimationStrobe(half) {
        // stripeType = -1;
        stripeType++;
        if (stripeType > 1) {
            stripeType = 0;
        }
        var className = 'animating-strobe-' + getStripeType(stripeType);
        if (half) {
            className = 'animating-strobe-half-' + getStripeType(stripeType);
        }
        triggerAnimation(pickInactivePath(), className);
    }


    var pulseColor = 0;

    function addAnimationPulse() {
        var className = 'animating-pulse-red';
        if (pulseColor === 0) {
            className = 'animating-pulse-blue';
        } if (pulseColor === 1) {
            className = 'animating-pulse-purple';
        }
        pulseColor++;
        if (pulseColor > 2) {
            pulseColor = 0;
        }
        triggerAnimation(pickInactivePath(), className);
    }

    function addAnimationPulseVar1() {
        var className = 'animating-pulse-var1';
        if (pulseColor === 0) {
            className = 'animating-pulse-var2';
        }
        pulseColor++;
        if (pulseColor > 2) {
            pulseColor = 0;
        }
        triggerAnimation(pickInactivePath(), className);
    }

    function randomLineTime() {
        return Math.random() * 4000 * 3 + 4000;
    }

    function createRandomLine() {
        setTimeout(function() {
            addAnimationLine();
        }, Math.random() * 800)
    }

    $(document).on('click', function() {
        if (INTERACTIVE) {
            switch (MODE) {
                case PULSE:
                    addAnimationPulse();
                    break;
                case LINE:
                    addAnimationLine();
                    break;
                case STROBE:
                    addAnimationStrobe(false);
                    break;
                case STROBE2:
                    addAnimationStrobe(true);
                    break;
            }
        }
    });

    // var timeoutAmount = 1.5;
    // document.addEventListener('mousemove', function(e) {
    //     var py = 1 - ((e.clientY)/ window.innerHeight);
    //     var timeMax = 3.0;
    //     var timeMin = 0.5;
    //     console.log(timeoutAmount);
    //     timeoutAmount =  ((timeMax - timeMin) * py) + timeMin;
    // });

    function getTimeoutAmount() {
        var timeMax = 3.0;
        var timeMin = 1.5;
        var percentage = 1 - (currentIterationsCount / maxIterations);
        if (currentMode === VARIABLE_LINES) {
            timeMax = 5.5;
            timeMin = 2.8;
        }
        return timeMin + percentage * (timeMax - timeMin);
    }

    function addAnimationLineVariableTime(animationTime, isVarient) {
        var pathNumber = pickInactivePath();
        var path = $('.shape-' + pathNumber);
        var length = path[0].getTotalLength();
        var animationType = 'lineDrawPulse-' + pathNumber;
        if (isVarient) {
            animationType = 'lineDrawPulseVar2-' + pathNumber;
        }
        var adjustedAnimationTime = (length * animationTime) / 1000;
        if (getTimeoutAmount() < adjustedAnimationTime) {
            adjustedAnimationTime = getTimeoutAmount();
        }
        var animation = animationType + ' ' + adjustedAnimationTime + 's infinite linear';
        path.css({
            animation: animation,
            'stroke-dashoffset': (Math.random()*length)
        });
        console.log(animation);
        setTimeout(function() {
            path.css('animation', 'none');
            clearActivePath(pathNumber);
        }, adjustedAnimationTime * 1000);
    }

    function addAnimationPulseVariableTime(animationTime) {
        var animationType = 'animatePulseRed';
        if (pulseColor === 0) {
            animationType = 'animatePulseBlue';
        } if (pulseColor === 1) {
            animationType = 'animatePulsePurple';
        }
        pulseColor++;
        if (pulseColor > 2) {
            pulseColor = 0;
        }
        var pathNumber = pickInactivePath();
        var path = $('.shape-' + pathNumber);
        var animation = animationType + ' ' + animationTime + 's infinite linear';
        console.log(animation);
        path.css({
            animation: animation
        });
        setTimeout(function() {
            path.css('animation', 'none');
            clearActivePath(pathNumber);
        }, animationTime * 1000);
    }

    function addAnimationPulseVariableTimeCombo(animationTime) {
        var animationType = 'animatePulseRed';
        if (pulseColor === 1) {
            animationType = 'animatePulseBlue';
        } if (pulseColor === 2) {
            animationType = 'animatePulsePurple';
        }
        pulseColor++;
        if (pulseColor > 0) {
            pulseColor = 0;
        }
        var pathNumber = pickInactivePath();
        var path = $('.shape-' + pathNumber);
        var animation = animationType + ' ' + animationTime + 's infinite linear';
        console.log(animation);
        path.css({
            animation: animation
        });
        setTimeout(function() {
            path.css('animation', 'none');
            clearActivePath(pathNumber);
        }, animationTime * 1000);
    }

    function coordinateVariablePulseDouble(timeoutAmount) {
        if (!checkIfCurrentMode(VARIABLE_TIME)) return;
        pulseTimeout1 = setTimeout(function() {
            checkModeChange();
            addAnimationPulseVariableTime(timeoutAmount);
            addAnimationPulseVariableTime(timeoutAmount);
            coordinateVariablePulseDouble(getTimeoutAmount());
        }, timeoutAmount * 1000);
    }

    function coordinateVariablePulse(timeoutAmount) {
        if (!checkIfCurrentMode(VARIABLE_TIME)) return;
        pulseTimeout2 = setTimeout(function() {
            addAnimationPulseVariableTime(timeoutAmount / 3);
            coordinateVariablePulse(getTimeoutAmount() * 3);
        }, timeoutAmount * 1000);
    }

    function coordinateVariablePulseCombo(timeoutAmount) {
        if (!checkIfCurrentMode(VARIABLE_LINES)) return;
        linesTimeout2 = setTimeout(function() {
            addAnimationPulseVariableTimeCombo(timeoutAmount / 2);
            coordinateVariablePulseCombo(getTimeoutAmount() * 3);
        }, timeoutAmount * 1000);
    }

    function coordinateVariableLine(timeoutAmount) {
        if (!checkIfCurrentMode(VARIABLE_LINES)) return;
        checkModeChange();
        linesTimeout3 = setTimeout(function() {
            addAnimationLineVariableTime(timeoutAmount, true);
            coordinateVariableLine(getTimeoutAmount());
        }, timeoutAmount * 1000);
    }

    function coordinateVariableLineVarient(timeoutAmount) {
        if (!checkIfCurrentMode(VARIABLE_LINES)) return;
        setTimeout(function() {
            addAnimationLineVariableTime(timeoutAmount, false);
            coordinateVariableLineVarient(getTimeoutAmount() * 1.75);
        }, timeoutAmount * 1000);
    }

    var linesTimeout1, linesTimeout2, linesTimeout3;
    function startLines() {
        linesTimeout1 = coordinateVariableLine(getTimeoutAmount());
        linesTimeout2 = coordinateVariableLineVarient(getTimeoutAmount() * 1.75);
        linesTimeout3 = coordinateVariablePulseCombo(getTimeoutAmount() * 3);
    }
    function stopLines() {
        clearTimeout(linesTimeout1);
        clearTimeout(linesTimeout2);
        clearTimeout(linesTimeout3);
    }

    var pulseTimeout1, pulseTimeout2;
    function startPulse() {
        pulseTimeout1 = coordinateVariablePulseDouble(getTimeoutAmount());
        pulseTimeout2 = coordinateVariablePulse(getTimeoutAmount() * 3);
    }

    function stopPulse() {
        clearTimeout(pulseTimeout1);
        clearTimeout(pulseTimeout2);
    }


    var maxIterations = 25;
    function checkModeChange() {
        currentIterationsCount++;
        console.log('iteration:', currentIterationsCount);
        if (currentIterationsCount > maxIterations) {
            console.log('CHANGING MODES');
            changeMode();
        }
    }
    var currentModeIndex = 0;
    var currentIterationsCount = 0;
    var currentMode = ACTIVE_MODES[currentModeIndex];
    function checkIfCurrentMode(mode) {
        return currentMode === mode;
    }

    function changeMode() {
        currentModeIndex++;
        currentIterationsCount = 0;
        stopLines();
        stopPulse();
        active = initialActive;
        if (currentModeIndex >= ACTIVE_MODES.length) {
            currentModeIndex = 0;
        }
        currentMode = ACTIVE_MODES[currentModeIndex];
        console.log('current mode!', currentMode);
        if (currentMode === VARIABLE_TIME) {
            startPulse();
        } else if (currentMode === VARIABLE_LINES) {
            startLines();
        }
    }

    // document.addEventListener('mousedown', function() {
    //     changeMode();
    // });


    if (!INTERACTIVE) {
        switch (MODE) {
            case SEQUENCE:
                currentMode = ACTIVE_MODES[currentModeIndex];
                console.log('currentMode', currentMode);
                changeMode();
                break;
            case VARIABLE_TIME:
                startPulse();
                break;
            case VARIABLE_LINES:
                startLines();
                break;
            case COMBO:
                addAnimationPulseVar1();
                setInterval(function() {
                    addAnimationPulseVar1();
                }, 2700);
                addAnimationLine();
                break;
            case PULSE:
                setInterval(function() {
                  addAnimationPulse();
                  addAnimationPulse();
                }, 2000);
                setInterval(function() {
                  addAnimationPulse();
                }, 3600);
                break;
            case LINE:
                createRandomLine();
                createRandomLine();
                createRandomLine();
                break;
            case STROBE:
                setInterval(function() {
                    addAnimationStrobe(false);
                    setTimeout(function() {
                        addAnimationStrobe(false);
                    }, 200)
                    setTimeout(function() {
                        addAnimationStrobe(false);
                    }, 400)
                }, 600);
                break;
            case STROBE2:
                setInterval(function() {
                    addAnimationStrobe(true);
                    addAnimationStrobe(true);
                }, 300);
                break;
        }
    }
// });
