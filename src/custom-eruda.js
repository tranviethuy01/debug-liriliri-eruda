(function () {
    const ERUDA_CDN = 'https://cdn.jsdelivr.net/npm/eruda';
    //const ERUDA_CDN = 'https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.min.js';

    // Prevent duplicate loading
    if (window.__myErudaLoading || window.__myErudaInitialized) {
        return;
    }

    window.__myErudaLoading = true;

    function initializeMyEruda() {
        window.__myErudaLoading = false;

        // Initialize Eruda
        eruda.init({
            autoScale: true,
            useShadowDom: true,
            defaults: {
                displaySize: 50,
                transparency: 1
            }
        });

        window.__myErudaInitialized = true;

        // ==================================
        // MY ERUDA KEYBOARD CONTROLLER
        // ==================================

        const config = eruda.get().config;

        let displaySize = 50;
        let fontScale = 1;

        const HEIGHT_STEP = 10;
        const FONT_STEP = 0.1;

        const MIN_HEIGHT = 10;
        const MAX_HEIGHT = 100;

        const MIN_FONT = 0.2;
        const MAX_FONT = 3;

        function setHeight(size) {
            displaySize = Math.max(
                MIN_HEIGHT,
                Math.min(MAX_HEIGHT, size)
            );

            config.set('displaySize', displaySize);

            console.log('Eruda height:', displaySize + '%');
        }

        function setFont(scale) {
            fontScale = Math.max(
                MIN_FONT,
                Math.min(MAX_FONT, scale)
            );

            eruda.scale(fontScale);

            console.log(
                'Eruda scale:',
                Math.round(fontScale * 100) + '%'
            );
        }

        // Keyboard shortcuts
        window.__myErudaKeyboardHandler = function (e) {
            if (
                ['INPUT', 'TEXTAREA'].includes(e.target.tagName) ||
                e.target.isContentEditable
            ) return;

            const key = e.key;

            // + / - : Change display height
            if (!e.shiftKey && (key === '+' || key === '=')) {
                setHeight(displaySize + HEIGHT_STEP);
            }
            else if (!e.shiftKey && key === '-') {
                setHeight(displaySize - HEIGHT_STEP);
            }

            // Shift + / Shift - : Change UI scale
            else if (e.shiftKey && (key === '+' || key === '=')) {
                setFont(fontScale + FONT_STEP);
            }
            else if (e.shiftKey && (key === '-' || key === '_')) {
                setFont(fontScale - FONT_STEP);
            }
            else {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        };

        document.addEventListener(
            'keydown',
            window.__myErudaKeyboardHandler,
            true
        );


        // Eruda tab shortcuts
        const ERUDA_TABS = {
            c: 'console',
            e: 'elements',
            n: 'network',
            r: 'resources',
            s: 'sources',
            i: 'info'
        };

        document.addEventListener('keydown', function (e) {
            if (!e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;

            // Avoid interfering with text input
            if (
                ['INPUT', 'TEXTAREA'].includes(e.target.tagName) ||
                e.target.isContentEditable
            ) return;

            const key = e.key.toLowerCase();
            const tab = ERUDA_TABS[key];

            if (!tab) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            eruda.get().showTool(tab);
        }, true);

        console.log('================================');
        console.log('MY ERUDA INITIALIZED');
        console.log('+       : Increase height');
        console.log('-       : Decrease height');
        console.log('Shift + : Zoom in');
        console.log('Shift - : Zoom out');
        console.log('Height  : 10% - 100%');
        console.log('Scale   : 20% - 300%');
        console.log('================================');
    

    } //end initializeMyEruda

    // Load Eruda
    if (window.eruda) {
        initializeMyEruda();
    } else {
        const script = document.createElement('script');

        script.src = ERUDA_CDN;
        script.onload = initializeMyEruda;

        script.onerror = function () {
            window.__myErudaLoading = false;
            console.error('Failed to load Eruda!');
        };

        (document.head || document.documentElement)
            .appendChild(script);
    }
})();

