// Database strategi makro beserta ID gambar internalnya
const strategyDb = {
    "axe": {
        skills: "Berserker's Call, Battle Hunger, Counter Helix, Culling Blade.",
        synergy: "Dazzle, Invoker, Dark Seer.",
        counters: ["Outworld Destroyer", "Viper", "Necrophos"],
        counters_desc: "Outworld Destroyer (Astral saat Axe Call), Viper (Break pasif Helix), Necrophos (Reaper's Scythe).",
        items: ["euls_scepter", "silver_edge", "spirit_vessel"],
        items_desc: "Eul's Scepter (Hentikan Axe saat Call), Silver Edge (Matikan pasif Helix), Spirit Vessel."
    },
    "phantom assassin": {
        skills: "Stifling Dagger, Phantom Strike, Blur, Fan of Knives, Coup de Grace.",
        synergy: "Magnus, Crystal Maiden, Omniknight.",
        counters: ["Razor", "Axe", "Timbersaw"],
        counters_desc: "Razor (Static Link curi damage), Axe (Call menembus Blur), Timbersaw (Burst magic tinggi).",
        items: ["monkey_king_bar", "ghost", "blade_mail"],
        items_desc: "Monkey King Bar (Bypass Miss Blur), Ghost Scepter (Anti Physical), Blade Mail."
    },
    "anti-mage": {
        skills: "Mana Break, Blink, Counterspell, Mana Void.",
        synergy: "Magnus, Grimstroke, Lion.",
        counters: ["Legion Commander", "Meepo", "Disruptor"],
        counters_desc: "Legion Commander (Duel langsung kunci Blink), Meepo (Earthbind mengunci Blink), Disruptor (Static Storm + Glimpse).",
        items: ["orchid", "bloodthorn", "sheepstick"],
        items_desc: "Orchid Malevolence / Bloodthorn (Silence agar tidak bisa Blink), Scythe of Vyse / Sheepstick (Hex instan)."
    },
    "invoker": {
        skills: "Quas, Wex, Exort, Invoke (Cold Snap, Ghost Walk, Tornado, EMP, Alacrity, Chaos Meteor, Sun Strike, Forge Spirit, Ice Wall, Deafening Blast).",
        synergy: "Faceless Void, Chrono/Tidehunter, Enigma.",
        counters: ["Nyx Assassin", "Anti-Mage", "Viper"],
        counters_desc: "Nyx Assassin (Mana Burn & Spiked Carapace), Anti-Mage (Mana Void sakit saat mana Invoker sekarat), Viper.",
        items: ["black_king_bar", "pipe", "orchid"],
        items_desc: "Black King Bar (BKB memblokir semua burst magic), Pipe of Insight, Orchid Malevolence."
    }
};

// Daftar alias/singkatan
const heroAlias = {
    "pa": "phantom assassin",
    "am": "anti-mage",
    "sk": "sand king",
    "es": "earthshaker",
    "od": "outworld destroyer"
};

let myChart = null;

document.getElementById('searchBtn').addEventListener('click', searchHero);
document.getElementById('heroSearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchHero();
});

async function searchHero() {
    let query = document.getElementById('heroSearch').value.toLowerCase().trim();
    if (!query) return;

    if (heroAlias[query]) query = heroAlias[query];

    try {
        const response = await fetch('https://api.opendota.com/api/heroStats');
        const heroes = await response.json();
        
        const hero = heroes.find(h => h.localized_name.toLowerCase() === query);

        if (hero) {
            document.getElementById('resultContainer').classList.remove('hidden');
            document.getElementById('heroName').innerText = hero.localized_name;
            
            let attrName = hero.primary_attr === "str" ? "STRENGTH 🟥" : 
                           hero.primary_attr === "agi" ? "AGILITY 🟩" : 
                           hero.primary_attr === "int" ? "INTELLIGENCE 🟦" : "UNIVERSAL 🟪";
            
            document.getElementById('heroType').innerText = `${attrName} - ${hero.attack_type}`;
            document.getElementById('heroImage').src = `https://cdn.cloudflare.steamstatic.com${hero.img}`;

            // --- GRAFIK PICK RATE ---
            const rankLabels = ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'];
            const rankData = [
                hero['1_pick'] || 0, hero['2_pick'] || 0, hero['3_pick'] || 0, hero['4_pick'] || 0,
                hero['5_pick'] || 0, hero['6_pick'] || 0, hero['7_pick'] || 0, hero['8_pick'] || 0
            ];

            if (myChart) myChart.destroy();

            const ctx = document.getElementById('rankChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: rankLabels,
                    datasets: [{
                        label: 'Total Pick',
                        data: rankData,
                        backgroundColor: 'rgba(163, 51, 51, 0.7)',
                        borderColor: 'rgba(163, 51, 51, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#bbb' } },
                        x: { grid: { display: false }, ticks: { color: '#bbb' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // --- STRATEGI & FOTO COUNTER ---
            const strategy = strategyDb[query] || {
                skills: "Data belum dimasukkan ke script.js.",
                synergy: "Data belum dimasukkan.",
                counters: [],
                counters_desc: "Data counter belum dianalisis.",
                items: [],
                items_desc: "Data item counter belum dimasukkan."
            };

            document.getElementById('heroSkills').innerText = strategy.skills;
            document.getElementById('heroSynergy').innerText = strategy.synergy;
            document.getElementById('heroCounters').innerText = strategy.counters_desc;
            document.getElementById('itemCounters').innerText = strategy.items_desc;

            // Foto Hero Counter
            const heroCounterBox = document.getElementById('heroCountersImages');
            heroCounterBox.innerHTML = '';
            strategy.counters.forEach(cName => {
                const targetHero = heroes.find(h => h.localized_name.toLowerCase() === cName.toLowerCase());
                if(targetHero) {
                    const img = document.createElement('img');
                    img.src = `https://cdn.cloudflare.steamstatic.com${targetHero.img}`;
                    img.title = targetHero.localized_name;
                    heroCounterBox.appendChild(img);
                }
            });

            // Foto Item Counter
            const itemCounterBox = document.getElementById('itemCountersImages');
            itemCounterBox.innerHTML = '';
            strategy.items.forEach(itemName => {
                const img = document.createElement('img');
                img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${itemName}.png`;
                img.title = itemName.replace('_', ' ');
                itemCounterBox.appendChild(img);
            });

        } else {
            alert("Hero tidak ditemukan! Gunakan ejaan bahasa Inggris resmi.");
        }
    } catch (error) {
        console.error(error);
        alert("Gagal memuat data.");
    }
}
