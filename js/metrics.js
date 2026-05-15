function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    const val = parseFloat(el.value);
    return (!isNaN(val) && val > 0) ? val : null;
}

function triggerResult(el) {
    el.classList.remove('reveal-result');
    void el.offsetWidth; 
    el.classList.add('reveal-result');
}

function calcBMI() {
    const w = getVal('w-bmi');
    const h = getVal('h-bmi');
    const age = getVal('age-bmi');
    const out = document.getElementById('out-bmi');

    if (w && h && age) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(1);
        let status = "NORMAL";
        let color = "#00c853";

        if (age >= 65) {
            if (bmi < 22) { status = "UNDERWEIGHT"; color = "#00e5ff"; }
            else if (bmi >= 27 && bmi < 30) { status = "OVERWEIGHT"; color = "#ff9100"; }
            else if (bmi >= 30) { status = "OBESE"; color = "#ff3131"; }
        } else {
            if (bmi < 18.5) { status = "UNDERWEIGHT"; color = "#00e5ff"; }
            else if (bmi >= 25 && bmi < 30) { status = "OVERWEIGHT"; color = "#ff9100"; }
            else if (bmi >= 30) { status = "OBESE"; color = "#ff3131"; }
        }
        out.style.color = color;
        out.innerText = `RESULT: ${bmi} (${status})`;
        triggerResult(out); 
    } else {
        out.innerText = "FILL ALL FIELDS";
        out.style.color = "#ff3131";
        triggerResult(out);
    }
}

function calcMaint() {
    const w = getVal('w-m');
    const h = getVal('h-m');
    const age = getVal('age');
    const s = parseFloat(document.getElementById('gen').value);
    const act = parseFloat(document.getElementById('level').value);
    const out = document.getElementById('out-maint');

    if (w && h && age) {
        const bmr = (10 * w) + (6.25 * h) - (5 * age) + s;
        const maintcal = Math.round(bmr * act);
        out.style.color = "#ff3131";
        out.innerText = `${maintcal} KCAL / DAY`;
        triggerResult(out); 
    } else {
        out.innerText = "CHECK INPUTS";
        out.style.color = "#ff3131";
        triggerResult(out);
    }
}

function calcDeficit() {
    const w = getVal('w-def');
    const h = getVal('h-def');
    const age = getVal('age-def');
    const s = parseFloat(document.getElementById('gen-def').value);
    const act = parseFloat(document.getElementById('level-def').value);
    const goal = getVal('goal-in');
    const out = document.getElementById('out-def');

    if (w && h && age && goal) {
        const bmr = (10 * w) + (6.25 * h) - (5 * age) + s;
        const maint = bmr * act;
        const target = Math.round(maint - goal);
        
        out.style.color = "#00c853";
        out.innerText = `TARGET: ${target} KCAL`;
        if (target < 1200) {
            out.style.color = "#ff3131";
            out.innerText += " (TOO LOW!)";
        }
        triggerResult(out); 
    } else {
        out.innerText = "FILL ALL FIELDS";
        out.style.color = "#ff3131";
        triggerResult(out);
    }
}

function showCalc(mode, btnElement) {
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const sections = document.querySelectorAll('.calc-mode-wrapper');
    sections.forEach(section => section.classList.remove('active'));

    const target = document.getElementById(mode + '-section');
    if (target) target.classList.add('active');
}