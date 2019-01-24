$(document).ready(function() {
    var VARIATION_1 = '1'
    var PULSE = 'PULSE';
    var LINE = 'LINE';
    var STROBE = 'STROBE';
    var STROBE2 = 'STROBE2';
    var MODES = [VARIATION_1, PULSE, LINE, STROBE, STROBE2];
    var MODE = VARIATION_1;

    var INTERACTIVE = false;
    var PATH_NUMBER = 8;

    var urlParams = new URLSearchParams(window.location.search);
    var mode = urlParams.get('mode');
    if (mode) {
        switch (mode) {
            case '1':
                MODE = VARIATION_1;
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

    function addAnimationLine() {
        var pathNumber = pickInactivePath();
        var className = 'animating-' + pathNumber;
        triggerAnimation(pathNumber, className);
    };

    function getStripeType(number) {
        switch (number) {
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

    function addAnimationPulse() {
        var className = 'animating-pulse';
        triggerAnimation(pickInactivePath(), className);
    }

    function addAnimationPulseVar1() {
        var className = 'animating-pulse-var1';
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

    if (!INTERACTIVE) {
        switch (MODE) {
            case VARIATION_1:
                addAnimationPulseVar1();
                setInterval(function() {
                    addAnimationPulseVar1();
                }, 1500);
                createRandomLine();
                setInterval(function() {
                    createRandomLine();
                }, 3000);
                break;
            case PULSE:
                setInterval(function() {
                  addAnimationPulse();
                }, 1000);
                break;
            case LINE:
                createRandomLine();
                createRandomLine();
                createRandomLine();
                setInterval(function() {
                    createRandomLine();
                    createRandomLine();
                    createRandomLine();
                }, randomLineTime());
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
