// Helper: Only returns positive numbers, ignores strings/negatives
function getVal(id) {
    const el = document.getElementById(id);
    const val = parseFloat(el.value);
    return (!isNaN(val) && val > 0) ? val : null;
}

function calcBMI() {
    const w = getVal('w-bmi');
    const h = getVal('h-bmi');
    const out = document.getElementById('out-bmi');

    if (w && h) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(1);
        let status = "NORMAL";
        let color = "#00c853";

        if (bmi < 18.5) { 
            status = "UNDERWEIGHT"; 
            color = "#00e5ff"; 
        }
        else if (bmi >= 25 && bmi < 30) {
            status = "OVERWEIGHT"; 
            color = "#ff9100"; 
        }
        else if (bmi >= 30) { 
            status = "OBESE"; 
            color = "#ff3131"; 
        }
        out.style.color = color;
        out.innerText = `RESULT: ${bmi} (${status})`;
    } else {
        out.innerText = "PLEASE ENTER VALID DATA";
        out.style.color = "#555";
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
    } else {
        out.innerText = "CHECK INPUTS";
        out.style.color = "#555";
    }
}

function calcDefcit() {
    const maint = getVal('maint-in');
    const goal = getVal('maint-in');
    const out = document.getElementById('out-def');

    if (maint && goal) {
        const target = maint-goal;
        
        if (target < 1200) {
            out.style.color = "#ff3131";
            out.innerText = `TARGET: ${target} KCAL (TOO LOW!)`;
        } else if (goal > 750) {
            out.style.color = "#ff9100";
            out.innerText = `TARGET: ${target} KCAL (AGGRESSIVE)`;
        } else {
            out.style.color = "#00c853";
            out.innerText = `TARGET: ${target} KCAL (HEALTHY)`;
        }
    } else {
        out.innerText = "ENTER MAINTENANCE KCAL & DEFICIT GOAL";
        out.style.color = "#555";
    }
}