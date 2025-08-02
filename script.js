document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const gradeSelector = document.getElementById('grade');
    const entropyValueSpan = document.getElementById('entropy-value');
    const debtBar = document.getElementById('debt-bar');

    let currentGrade = gradeSelector.value;
    let entropyDebt = 0;
    const maxEntropy = {
        'Citizen': 1e6,
        'Technician': 1e8,
        'Medic': 1e9,
        'Architect': 1e11,
        'Root': Infinity
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
        if (percentage > 100) {
            debtBar.style.backgroundColor = '#ff4141';
        } else {
            debtBar.style.backgroundColor = '#ffc107';
        }
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
});
