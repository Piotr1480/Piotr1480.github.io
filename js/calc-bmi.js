//Oblicza BMI na podstawie masy (kg) i wzrostu (cm). Zwraca liczbę niezaokrągloną.
 function calculateBmiKgCm(weightKg, heightCm) {
    const w = Number(String(weightKg).replace(',', '.'));
    const hCm = Number(String(heightCm).replace(',', '.'));
    if (!isFinite(w) || !isFinite(hCm) || w <= 0 || hCm <= 0) {
        throw new Error('Użyj dodatnich liczb dla masy i wzrostu.');
    }
    const hM = hCm / 100;
    return w / (hM * hM);
}

//Klasyfikacja BMI dla dorosłych (standardowe progi). Zwraca kategorię.
function classifyAdultBmi(bmi) {
    const b = Number(bmi);
    if (!isFinite(b) || b <= 0) throw new Error('Nieprawidłowe BMI.');

    if (b < 18.5) return { category: 'Niedowaga' };
    if (b < 25)   return { category: 'Prawidłowa masa' };
    if (b < 30)   return { category: 'Nadwaga' };
    if (b < 35)   return { category: 'Otyłość I' };
    if (b < 40)   return { category: 'Otyłość II' };
    return { category: 'Otyłość III' };
}

//Formatowanie BMI do prezentacji (domyślnie 1 miejsce po przecinku, przecinek jako separator dziesiętny).
//function formatBmi(bmi, decimals = 1) {
//    const factor = 10 ** decimals;
//    return (Math.round(Number(bmi) * factor) / factor).toFixed(decimals).replace('.', ',');
//}

//Prosta walidacja wejścia. Dostosuj zakresy do swojego UI.
function validateInputs({ weightKg, heightCm }) {
    const errors = [];
    const w = Number(String(weightKg).replace(',', '.'));
    const h = Number(String(heightCm).replace(',', '.'));

    if (!isFinite(w) || !isFinite(h)) errors.push('Użyj prawidłowych liczb.');
    if (!(w > 0) || !(h > 0)) errors.push('Użyj dodatnich liczb.');
    if (h < 120 || h > 230) errors.push('Wzrost poza zakresem 120–230 cm.');
    if (w < 30 || w > 250) errors.push('Masa ciała poza zakresem 30–250 kg.');

    return errors;
}

//Buduje krótki opis dla dorosłych.
function buildAdultInterpretation(cls) {
    let text;
    switch (cls.category) {
        case 'Niedowaga':
            text = 'BMI jest poniżej wyznaczonej normy. Pomocna może okazać się konsultacja z dietetykiem, aby zidentyfikować przyczyny niskiej masy ciała oraz wprowadzić zmiany w sposobie odżywiania i codziennym stylu życia, przeciwdziałające niedożywieniu i wspierające utrzymanie dobrego stanu zdrowia, kondycji i samopoczucia.';
            break;
        case 'Prawidłowa masa':
            text = 'BMI jest w normie. Nie zwalnia to jednak ze stosowania zasad zdrowego odżywiania, aby przeciwdziałać ewentualnemu wystąpieniu nadmiernej masy ciała w przyszłości. Właściwy sposób odżywienia na co dzień pomoże utrzymać dobry stan zdrowia, kondycję i samopoczucie, a także będzie pomocny w zmniejszeniu ryzyka wystąpienia chorób cywilizacyjnych.';
            break;
        case 'Nadwaga':
            text = 'BMI jest powyżej wyznaczonej normy. Pomocna może okazać się konsultacja z dietetykiem, aby zidentyfikować przyczyny nadmiernej masy ciała oraz wprowadzić zmiany w sposobie odżywiania i codziennym stylu życia, przeciwdziałające rozwojowi chorób cywilizacyjnych (np. cukrzyca, choroby sercowo-naczyniowe, nadciśnienie) i wspierające utrzymanie dobrego stanu zdrowia, samopoczucia i smukłej sylwetki.';
            break;
        case 'Otyłość I':
            text = 'BMI jest powyżej wyznaczonej normy i świadczy o I stopniu otyłości. Zalecamy konsultację z dietetykiem, aby zidentyfikować przyczyny nadmiernej masy ciała oraz wprowadzić zmiany w sposobie odżywiania i codziennym stylu życia, istotne dla uzyskania prawidłowych parametrów zdrowotnych, przeciwdziałające rozwojowi chorób cywilizacyjnych i wspierające uzyskanie dobrego samopoczucia. Otyłość w znaczącym stopniu zwiększa ryzyko wystąpienia udaru mózgu, zawału, chorób sercowo-naczyniowych, cukrzycy typu II. Stopniowy spadek masy ciała będzie zmniejszał ryzyko wystąpienia powikłań związanych z wystąpieniem otyłości.';
            break;
        case 'Otyłość II':
            text = 'BMI jest powyżej wyznaczonej normy i świadczy o II stopniu otyłości. Zalecamy pilną konsultację z dietetykiem, aby zidentyfikować przyczyny nadmiernej masy ciała oraz wprowadzić zmiany w sposobie odżywiania i codziennym stylu życia, istotne dla uzyskania prawidłowych parametrów zdrowotnych, przeciwdziałające rozwojowi chorób cywilizacyjnych i wspierające uzyskanie dobrego samopoczucia. Otyłość w znaczącym stopniu zwiększa ryzyko wystąpienia udaru mózgu, zawału, chorób sercowo-naczyniowych, cukrzycy typu II. Stopniowy spadek masy ciała będzie zmniejszał ryzyko wystąpienia powikłań związanych z wystąpieniem otyłości.';
            break;
        case 'Otyłość III':
            text = 'BMI jest powyżej wyznaczonej normy i świadczy o III stopniu otyłości. Zalecamy konsultację z dietetykiem, aby zidentyfikować przyczyny otyłości oraz wprowadzić zmiany w sposobie odżywiania i codziennym stylu życia, istotne dla zmniejszenia masy ciała i poprawy parametrów zdrowotnych, przeciwdziałające rozwojowi chorób cywilizacyjnych i wspierające uzyskanie dobrego samopoczucia. Otyłość w znaczącym stopniu zwiększa ryzyko wystąpienia udaru mózgu, zawału, chorób sercowo-naczyniowych, cukrzycy typu II, bezdechu sennego, kamicy pęcherzyka żółciowego. Stopniowa redukcja masy ciała będzie zmniejszała ryzyko wystąpienia powikłań związanych z wystąpieniem otyłości.';
            break;
        default:
            text = 'Interpretacja niedostępna.';
    }
    return { text };
}

//Główna funkcja – zwraca wynik i opis.
function evaluateBmi({ weightKg, heightCm }) {
    const errors = validateInputs({ weightKg, heightCm });
    if (errors.length) {
        return { ok: false, errors };
    }

    const bmiRaw = calculateBmiKgCm(weightKg, heightCm);
    const cls = classifyAdultBmi(bmiRaw);
    const interp = buildAdultInterpretation(cls);

    updateBMIIndicator(parseFloat(bmiRaw));
    showBMIResult(parseFloat(bmiRaw));

    return {
        ok: true,
        interpretation: interp.text
    };
}

function updateBMIIndicator(bmi) {
    const pointer = document.getElementById('bmiPointer');
    const valueDisplay = document.getElementById('bmiValue');

    // Oblicz pozycję na skali (0-100%)
    let position;

    if (bmi < 18.5) {
        // Niedowaga: 0-15%
        position = Math.max(0, Math.min(15, (bmi / 18.5) * 15));
    } else if (bmi < 25) {
        // Waga prawidłowa: 15-40%
        position = 15 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
        // Nadwaga: 40-55%
        position = 40 + ((bmi - 25) / (30 - 25)) * 15;
    } else if (bmi < 35) {
        // Otyłość I: 55-70%
        position = 55 + ((bmi - 30) / (35 - 30)) * 15;
    } else if (bmi < 40) {
        // Otyłość II: 70-85%
        position = 70 + ((bmi - 35) / (40 - 35)) * 15;
    } else {
        // Otyłość III: 85-100%
        position = Math.min(100, 85 + ((bmi - 40) / 10) * 15);
    }

    pointer.style.left = position + '%';
    valueDisplay.textContent = `BMI: ${bmi.toFixed(1)}`;
}

function showBMIResult(bmi) {
    const resultDiv = document.getElementById('bmiResult');
    let category, categoryClass, description;

    if (bmi < 18.5) {
        category = 'Niedowaga';
        categoryClass = 'category-niedowaga';
        description = 'Twoje BMI wskazuje na niedowagę.';
    } else if (bmi < 25) {
        category = 'Waga prawidłowa';
        categoryClass = 'category-prawidlowa';
        description = 'Twoje BMI jest w normie.';
    } else if (bmi < 30) {
        category = 'Nadwaga';
        categoryClass = 'category-nadwaga';
        description = 'Twoje BMI wskazuje na nadwagę.';
    } else if (bmi < 35) {
        category = 'Otyłość I stopnia';
        categoryClass = 'category-otylosc1';
        description = 'Twoje BMI wskazuje na otyłość I stopnia.';
    } else if (bmi < 40) {
        category = 'Otyłość II stopnia';
        categoryClass = 'category-otylosc2';
        description = 'Twoje BMI wskazuje na otyłość II stopnia.';
    } else {
        category = 'Otyłość III stopnia';
        categoryClass = 'category-otylosc3';
        description = 'Twoje BMI wskazuje na otyłość III stopnia.';
    }

    resultDiv.className = `bmi-result ${categoryClass}`;
    resultDiv.innerHTML = `
                <div>BMI: ${bmi.toFixed(1)} kg/m²</div>
                <div>Kategoria: ${category}</div>
                <div>${description}</div>
            `;
    resultDiv.style.display = 'block';
}

// ===== Obsługa UI =====
document.getElementById('calcBtn').addEventListener('click', () => {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const resultDiv = document.getElementById('calc-bmi-result-interp');

    const result = evaluateBmi({ weightKg: weight, heightCm: height });

    if (!result.ok) {
        resultDiv.innerHTML = `<div class="error">${result.errors.join('<br>')}</div>`;
        resultDiv.style.display = 'block';
        return;
    }

    resultDiv.innerHTML = `
        <em>${result.interpretation}</em><br>
    `;
    resultDiv.style.display = 'block';
});


