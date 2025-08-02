document.addEventListener('DOMContentLoaded', () => {
    // 네온 색상 변동 기능
    const colorThemes = ['#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#ff8c00'];
    let currentColorIndex = 0;

    function changeTheme(color) {
        document.documentElement.style.setProperty('--neon-color', color);
        const elements = document.querySelectorAll('.container, .info-panel, .info-panel h1, .grade-selector select, .entropy-debt, .debt-bar-container, .debt-bar, .output, .input-line, #input, #login-box');
        elements.forEach(el => {
            el.style.borderColor = color;
        });
        document.body.style.color = color;
        document.querySelector('.container').style.boxShadow = `0 0 20px ${color}`;
        document.querySelector('.debt-bar').style.backgroundColor = color;
        const textElements = document.querySelectorAll('p, span, h1, label, button, select, input');
        textElements.forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 5px ${color}`;
        });
    }

    // 10초마다 자동으로 색상 변경
    setInterval(() => {
        currentColorIndex = (currentColorIndex + 1) % colorThemes.length;
        changeTheme(colorThemes[currentColorIndex]);
    }, 10000);

    // 초기 색상 설정
    changeTheme(colorThemes[0]);

    // 로그인 시스템 기능
    function showLogin() {
        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';
        loginContainer.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            background-color: #0d1117; z-index: 100;
        `;
        loginContainer.innerHTML = `
            <div id="login-box" style="
                border: 2px solid var(--neon-color); padding: 40px;
                box-shadow: 0 0 20px var(--neon-color); background-color: rgba(13, 17, 23, 0.9);
                text-align: center;
            ">
                <h1 style="color: var(--neon-color); text-shadow: 0 0 5px var(--neon-color);">AMB Login</h1>
                <p style="color: var(--neon-color);">User ID:</p>
                <input type="text" id="login-id" placeholder="Enter your ID" style="
                    background-color: transparent; border: 1px solid var(--neon-color);
                    color: var(--neon-color); padding: 5px; margin: 10px 0;
                    font-family: 'Courier New', Courier, monospace; outline: none;
                ">
                <button id="login-button" style="
                    background-color: transparent; border: 1px solid var(--neon-color);
                    color: var(--neon-color); padding: 8px 15px; cursor: pointer;
                    font-family: 'Courier New', Courier, monospace;
                ">Connect</button>
                <p id="login-status" style="color: var(--neon-color);"></p>
            </div>
        `;
        document.body.appendChild(loginContainer);

        document.getElementById('login-button').addEventListener('click', handleLogin);
        document.getElementById('login-id').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    function handleLogin() {
        const loginIdInput = document.getElementById('login-id');
        const loginId = loginIdInput.value.trim();
        const loginStatus = document.getElementById('login-status');
        
        const authorizedUsers = ['Neo', 'Trinity', 'Morpheus'];

        if (authorizedUsers.includes(loginId)) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-container').style.display = 'flex';
            document.getElementById('user-id').textContent = `User ID: ${loginId}`;
            trackUser(loginId);
            initializeTerminal();
        } else {
            loginStatus.textContent = 'ERROR: Invalid User ID.';
            loginStatus.style.color = '#ff4141';
        }
    }

    // 로그인한 사용자 추적 기능
    function trackUser(userId) {
        let trackedUsers = localStorage.getItem('trackedUsers');
        if (trackedUsers) {
            trackedUsers = JSON.parse(trackedUsers);
        } else {
            trackedUsers = [];
        }

        if (!trackedUsers.includes(userId)) {
            trackedUsers.push(userId);
            localStorage.setItem('trackedUsers', JSON.stringify(trackedUsers));
        }
    }

    // 모든 접속 사용자 목록을 확인하려면 콘솔에 getTrackedUsers() 입력
    function getTrackedUsers() {
        let trackedUsers = localStorage.getItem('trackedUsers');
        return trackedUsers ? JSON.parse(trackedUsers) : [];
    }

    // 기존 초기화 로직을 함수로 묶음
    function initializeTerminal() {
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        const gradeSelector = document.getElementById('grade');
        const entropyValueSpan = document.getElementById('entropy-value');
        const debtBar = document.getElementById('debt-bar');

        let currentGrade = gradeSelector.value;
        let entropyDebt = 0;
        const maxEntropy = {
            'Citizen': 1e6, 'Technician': 1e8, 'Medic': 1e9, 'Architect': 1e11, 'Root': Infinity
        };

        const spells = {
            'PROTOCOL_SYNTH_AU_v1': { grade: 'Architect', debt: 7.2e12 },
            'PROTOCOL_SYNTH_STEEL_v2': { grade: 'Technician', debt: 1.5e9 },
            'FIREBALL_v1': { grade: 'Technician', debt: 4.8e7 },
            'HEALING_TOUCH_v2': { grade: 'Medic', debt: 2.1e6 },
            'MATTER_ERASURE_v1': { grade: 'Root', debt: 9.9e11 },
            'CREATE_WATER_v1': { grade: 'Technician', debt: 3.2e7 }
        };

        function appendOutput(message) {
            const p = document.createElement('p');
            p.textContent = `> ${message}`;
            output.appendChild(p);
            output.scrollTop = output.scrollHeight;
        }

        function updateEntropyDisplay() {
            entropyValueSpan.textContent = `${entropyDebt.toExponential(2)} J/K`;
            const percentage = (entropyDebt / maxEntropy[currentGrade]) * 100;
            debtBar.style.width = `${Math.min(percentage, 100)}%`;
            debtBar.style.backgroundColor = percentage > 100 ? '#ff4141' : 'var(--neon-color)';
        }

        gradeSelector.addEventListener('change', (e) => {
            currentGrade = e.target.value;
            appendOutput(`AMB Protocol v1.0] Permission Key updated. Current Level: ${currentGrade}.`);
            updateEntropyDisplay();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                appendOutput(`> ${command}`);
                input.value = '';

                const spellNameMatch = command.match(/protocol\s+(\w+)/);
                if (spellNameMatch) {
                    const spellName = spellNameMatch[1];
                    if (spells[spellName]) {
                        const requiredGrade = spells[spellName].grade;
                        const requiredDebt = spells[spellName].debt;

                        if (maxEntropy[currentGrade] >= requiredDebt) {
                            appendOutput(`[AMB Protocol v1.0] Order Accepted: ${spellName}. Execution started. Entropy Debt incurred: ${requiredDebt.toExponential(2)} J/K.`);
                            entropyDebt += requiredDebt;
                        } else {
                            appendOutput(`[AMB Protocol v1.0] ERROR: Insufficient Entropy Budget. Required: ${requiredDebt.toExponential(2)} J/K. Current Limit: ${maxEntropy[currentGrade].toExponential(2)} J/K.`);
                        }
                    } else {
                        appendOutput(`[AMB Protocol v1.0] ERROR: Unknown protocol. Please check your spelling.`);
                    }
                } else {
                    appendOutput(`[AMB Protocol v1.0] ERROR: Invalid command format. Use 'protocol [spell_name] { ... }'`);
                }
                updateEntropyDisplay();
            }
        });

        // 초기 터미널 메시지 출력
        appendOutput(`AMB Protocol v1.0 connected.`);
        appendOutput(`Welcome, ${document.getElementById('user-id').textContent}. Enter your spell protocol.`);
    }

    // 페이지 로드 시 로그인 창 먼저 표시
    showLogin();
});
