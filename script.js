// 시작
document.addEventListener('DOMContentLoaded', () => {
    // 네온 색상 변동 기능
    const colorThemes = ['#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#ff8c00'];
    let currentColorIndex = 0;

    function changeTheme(color) {
        document.documentElement.style.setProperty('--neon-color', color);
        const elements = document.querySelectorAll('#main-container, .info-panel, .info-panel h1, .grade-selector select, .entropy-debt, .debt-bar-container, .debt-bar, .output, .input-line, #input, #login-box, #login-box input, #login-box button, #login-box a');
        elements.forEach(el => {
            if (el.id !== 'debt-bar') {
                el.style.borderColor = color;
            }
        });
        document.body.style.color = color;
        const mainContainer = document.querySelector('#main-container');
        if (mainContainer) {
            mainContainer.style.boxShadow = `0 0 20px ${color}`;
        }
        const debtBar = document.querySelector('.debt-bar');
        if (debtBar) {
            debtBar.style.backgroundColor = color;
        }
        const textElements = document.querySelectorAll('p, span, h1, label, button, select, input, a');
        textElements.forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 5px ${color}`;
        });
    }

    setInterval(() => {
        currentColorIndex = (currentColorIndex + 1) % colorThemes.length;
        changeTheme(colorThemes[currentColorIndex]);
    }, 10000);

    changeTheme(colorThemes[0]);

    // 로그인 시스템 기능
    let originalLoginHTML;

    function showLogin() {
        // 기존 로그인 컨테이너가 있으면 제거
        const existingLoginContainer = document.getElementById('login-container');
        if (existingLoginContainer) {
            existingLoginContainer.remove();
        }

        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';
        loginContainer.innerHTML = `
            <div id="login-box">
                <h1>AMB Login</h1>
                <p>User ID:</p>
                <input type="text" id="login-id" placeholder="Enter your ID">
                <p>Password:</p>
                <input type="password" id="login-pw" placeholder="Enter your password">
                <button id="login-button">Connect</button>
                <p><a href="#" id="signup-link">회원가입</a></p>
                <p id="login-status"></p>
            </div>
        `;
        document.body.appendChild(loginContainer);
        originalLoginHTML = document.getElementById('login-box').innerHTML; // 이 부분이 중요!
        
        document.getElementById('login-button').addEventListener('click', handleLogin);
        document.getElementById('login-id').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        document.getElementById('login-pw').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        document.getElementById('signup-link').addEventListener('click', showSignup);
    }

    function showSignup(e) {
        if (e) e.preventDefault();
        const loginBox = document.getElementById('login-box');
        loginBox.innerHTML = `
            <h1>AMB Register</h1>
            <p>New User ID:</p>
            <input type="text" id="signup-id" placeholder="Create new ID">
            <p>Email:</p>
            <input type="email" id="signup-email" placeholder="Enter your email">
            <p>Password:</p>
            <input type="password" id="signup-pw" placeholder="Create password">
            <p>Request Grade:</p>
            <select id="signup-grade">
                <option value="Citizen">Citizen</option>
                <option value="Technician" disabled>Technician</option>
            </select>
            <button id="register-button">Register</button>
            <p><a href="#" id="login-link">로그인으로 돌아가기</a></p>
            <p id="signup-status"></p>
        `;
        document.getElementById('register-button').addEventListener('click', handleRegister);
        document.getElementById('login-link').addEventListener('click', (event) => {
            event.preventDefault();
            const loginBox = document.getElementById('login-box');
            loginBox.innerHTML = originalLoginHTML;
            showLogin();
        });
    }

    async function handleRegister() {
        const id = document.getElementById('signup-id').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-pw').value.trim();
        const grade = document.getElementById('signup-grade').value;
        const signupStatus = document.getElementById('signup-status');

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, email, password, grade })
            });
            const result = await response.json();

            if (response.ok) {
                signupStatus.textContent = result.message;
                signupStatus.style.color = 'var(--neon-color)';
                showVerificationStep(id);
            } else {
                signupStatus.textContent = `ERROR: ${result.error}`;
                signupStatus.style.color = '#ff4141';
            }
        } catch (error) {
            signupStatus.textContent = 'ERROR: 서버 연결 실패. 서버가 실행 중인지 확인하세요.';
            signupStatus.style.color = '#ff4141';
        }
    }

    function showVerificationStep(id) {
        const loginBox = document.getElementById('login-box');
        loginBox.innerHTML = `
            <h1>Email Verification</h1>
            <p>이메일로 인증 코드를 보냈습니다.</p>
            <p>아래에 코드를 입력하세요:</p>
            <input type="text" id="verify-code" placeholder="6자리 코드 입력">
            <button id="verify-button">Verify</button>
            <p id="verify-status"></p>
        `;
        document.getElementById('verify-button').addEventListener('click', () => handleVerification(id));
    }

    async function handleVerification(id) {
        const code = document.getElementById('verify-code').value.trim();
        const verifyStatus = document.getElementById('verify-status');

        try {
            const response = await fetch('http://localhost:3000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, code })
            });
            const result = await response.json();

            if (response.ok) {
                verifyStatus.textContent = result.message;
                verifyStatus.style.color = 'var(--neon-color)';
                setTimeout(() => {
                    const loginBox = document.getElementById('login-box');
                    loginBox.innerHTML = originalLoginHTML;
                    // 로그인 페이지로 돌아간 후 메시지 표시
                    document.getElementById('login-status').textContent = '인증이 완료되었습니다. 로그인하세요.';
                    document.getElementById('login-status').style.color = 'var(--neon-color)';
                    document.getElementById('login-button').addEventListener('click', handleLogin);
                    document.getElementById('login-id').addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') handleLogin();
                    });
                    document.getElementById('login-pw').addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') handleLogin();
                    });
                    document.getElementById('signup-link').addEventListener('click', showSignup);
                }, 3000);
            } else {
                verifyStatus.textContent = `ERROR: ${result.error}`;
                verifyStatus.style.color = '#ff4141';
            }
        } catch (error) {
            verifyStatus.textContent = 'ERROR: 서버 연결 실패. 서버가 실행 중인지 확인하세요.';
            verifyStatus.style.color = '#ff4141';
        }
    }

    async function handleLogin() {
        const loginIdInput = document.getElementById('login-id');
        const loginPwInput = document.getElementById('login-pw');
        const loginId = loginIdInput.value.trim();
        const loginPw = loginPwInput.value.trim();
        const loginStatus = document.getElementById('login-status');
    
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: loginId, password: loginPw })
            });
            const result = await response.json();
    
            if (response.ok) {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('main-container').style.display = 'flex';
                document.getElementById('user-id').textContent = `User ID: ${result.user.id}`;
                trackUser(result.user.id);
                document.getElementById('grade').value = result.user.grade;
                initializeTerminal();
            } else {
                loginStatus.textContent = `ERROR: ${result.error}`;
                loginStatus.style.color = '#ff4141';
            }
        } catch (error) {
            loginStatus.textContent = 'ERROR: 서버 연결 실패. 서버가 실행 중인지 확인하세요.';
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
    
    function getTrackedUsers() {
        let trackedUsers = localStorage.getItem('trackedUsers');
        return trackedUsers ? JSON.parse(trackedUsers) : [];
    }
    
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

        appendOutput(`AMB Protocol v1.0 connected.`);
        appendOutput(`Welcome, ${document.getElementById('user-id').textContent}. Enter your spell protocol.`);
    }

    showLogin();
});
// 끝
