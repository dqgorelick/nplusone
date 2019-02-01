$(document).ready(function() {
    var COMBO = 'combo'
    var PULSE = 'PULSE';
    var LINE = 'LINE';
    var STROBE = 'STROBE';
    var STROBE2 = 'STROBE2';
    var VARIBLE_TIME = 'VARIBLE_TIME';
    var VARIABLE_LINES = 'VARIABLE_LINES';
    var MODES = [COMBO, PULSE, LINE, STROBE, STROBE2];
    var MODE = COMBO;

    var INTERACTIVE = false;
    var PATH_NUMBER = 8;

    var urlParams = new URLSearchParams(window.location.search);
    var mode = urlParams.get('mode');
    if (mode) {
        switch (mode) {
            case 'changing':
                MODE = VARIBLE_TIME;
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

    var timeoutAmount = 1.5;

    document.addEventListener('mousemove', function(e) {
        var py = 1 - ((e.clientY)/ window.innerHeight);
        var timeMax = 3.0;
        var timeMin = 0.5;
        console.log(timeoutAmount);
        timeoutAmount =  ((timeMax - timeMin) * py) + timeMin;
    });

    function getTimeoutAmount() {
        return timeoutAmount;
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

    function coordinateVariableLine(timeoutAmount) {
        setTimeout(function() {
            addAnimationLineVariableTime(timeoutAmount, false);
            coordinateVariableLine(getTimeoutAmount());
        }, timeoutAmount * 1000);
    }

    function coordinateVariableLineVarient(timeoutAmount) {
        setTimeout(function() {
            addAnimationLineVariableTime(timeoutAmount, true);
            coordinateVariableLineVarient(getTimeoutAmount() * 1.25);
        }, timeoutAmount * 1000);
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

    function coordinateVariablePulseDouble(timeoutAmount) {
        setTimeout(function() {
            addAnimationPulseVariableTime(timeoutAmount);
            addAnimationPulseVariableTime(timeoutAmount);
            coordinateVariablePulseDouble(getTimeoutAmount());
        }, timeoutAmount * 1000);
    }

    function coordinateVariablePulse(timeoutAmount) {
        console.log('running pulse')
        setTimeout(function() {
            addAnimationPulseVariableTime(timeoutAmount);
            coordinateVariablePulse(getTimeoutAmount() * 1.5);
        }, timeoutAmount * 1000);
    }

    if (!INTERACTIVE) {
        switch (MODE) {
            case VARIBLE_TIME:
                coordinateVariablePulseDouble(getTimeoutAmount());
                coordinateVariablePulse(getTimeoutAmount() * 1.5);
                break;
            case VARIABLE_LINES:
                coordinateVariableLine(getTimeoutAmount());
                coordinateVariableLineVarient(getTimeoutAmount() * 1.5);
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
});
