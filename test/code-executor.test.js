// Test suite for code-executor.js
describe('Code Executor', function() {
    // Setup mock DOM elements before tests
    before(function() {
        // Create mock DOM elements that the code executor expects
        const mockElements = `
            <textarea id="code">go();</textarea>
            <div id="timer">0.00</div>
            <div id="errorMessage"></div>
            <input type="checkbox" id="loopCheckbox" />
            <div id="stage"></div>
            <div id="avatar"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', mockElements);
    });

    // Clean up after tests
    after(function() {
        const elementsToRemove = ['code', 'timer', 'errorMessage', 'loopCheckbox', 'stage', 'avatar'];
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });
    });

    beforeEach(function() {
        // Reset game state before each test
        if (window.resetPosition) {
            window.resetPosition();
        }
        
        // Clear any error messages
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        
        // Reset code textarea
        const codeTextarea = document.getElementById('code');
        if (codeTextarea) {
            codeTextarea.value = 'go();';
        }
    });

    describe('parseNumber function', function() {
        it('should return 1 for undefined input', function() {
            expect(window.parseNumber()).to.equal(1);
        });

        it('should return the number if input is a number', function() {
            expect(window.parseNumber(5)).to.equal(5);
            expect(window.parseNumber(0)).to.equal(0);
            expect(window.parseNumber(-3)).to.equal(-3);
        });

        it('should return 1 for non-number input', function() {
            expect(window.parseNumber('hello')).to.equal(1);
            expect(window.parseNumber(null)).to.equal(1);
            expect(window.parseNumber({})).to.equal(1);
        });
    });

    describe('Game State Management', function() {
        it('should have initial position at (0, 0)', function() {
            window.resetPosition();
            expect(window.gameState.position.x).to.equal(0);
            expect(window.gameState.position.y).to.equal(0);
        });

        it('should have initial direction facing east (1)', function() {
            window.resetPosition();
            expect(window.gameState.direction).to.equal(1);
        });

        it('should be within bounds at initial position', function() {
            window.resetPosition();
            expect(window.withinBounds()).to.be.true;
        });
    });

    describe('Direction Management', function() {
        it('should set direction correctly with modulo', function() {
            window.setDirection(0); // North
            expect(window.gameState.direction).to.equal(0);
            
            window.setDirection(4); // Should wrap to North (0)
            expect(window.gameState.direction).to.equal(0);
            
            window.setDirection(-1); // Should wrap to West (3)
            expect(window.gameState.direction).to.equal(3);
        });
    });

    describe('Free Space Detection', function() {
        it('should return a number representing free spaces', function() {
            window.resetPosition();
            const freeSpaces = window.free();
            expect(freeSpaces).to.be.a('number');
            expect(freeSpaces).to.be.at.least(0);
        });
    });

    describe('Movement Functions', function() {
        it('should have go function available', function() {
            expect(window.go).to.be.a('function');
        });

        it('should have left function available', function() {
            expect(window.left).to.be.a('function');
        });

        it('should have right function available', function() {
            expect(window.right).to.be.a('function');
        });
    });

    describe('Timer Functions', function() {
        it('should have timer functions available', function() {
            expect(window.startTimer).to.be.a('function');
            expect(window.stopTimer).to.be.a('function');
            expect(window.resetTimer).to.be.a('function');
        });
    });

    describe('Code Execution Functions', function() {
        it('should have start function available', function() {
            expect(window.start).to.be.a('function');
        });

        it('should have stop function available', function() {
            expect(window.stop).to.be.a('function');
        });
    });

    describe('Basic Integration Test', function() {
        it('should be able to call movement functions without errors', function() {
            // This is a basic smoke test to ensure functions can be called
            expect(() => {
                window.resetPosition();
                window.left();
                window.right();
            }).to.not.throw();
        });
    });
});