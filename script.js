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
        skills: "Quas, Wex, Exort, Invoke (10 Kombinasi Kombinasi Skill Aktif).",
        synergy: "Faceless Void, Tidehunter, Enigma.",
        counters: ["Nyx Assassin", "Anti-Mage", "Viper"],
        counters_desc: "Nyx Assassin (Mana Burn & Spiked Carapace), Anti-Mage (Mana Void sakit saat mana Invoker sekarat), Viper.",
        items: ["black_king_bar", "pipe", "orchid"],
        items_desc: "Black King Bar (BKB memblokir semua burst magic), Pipe of Insight, Orchid Malevolence."
    },
    "night stalker": {
        skills: "Void, Crippling Fear, Hunter in the Night, Dark Ascension.",
        synergy: "Dark Seer, Keeper of the Light, Bounty Hunter.",
        counters: ["Slark", "Bloodseeker", "Timbersaw"],
        counters_desc: "Slark (Bisa meloloskan diri dengan Pounce/Ulti saat malam), Bloodseeker (Thirst mendeteksi NS), Timbersaw (Pure burst damage tinggi).",
        items: ["force_staff", "ghost", "heaven_halberd"],
        items_desc: "Force Staff (Kabur dari area Crippling Fear), Ghost Scepter (Hindari serangan fisik malam hari), Heaven's Halberd."
    }
};

const heroAlias = {
    "pa": "phantom assassin", "am": "anti-mage", "ns": "night stalker",
    "sk": "sand king", "es": "earthshaker", "od": "outworld destroyer"
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
            
            let isStr = hero.primary_attr === "str";
            let isAgi = hero.primary_attr === "agi";
            let isInt = hero.primary_attr === "int";
            
            let attrName = isStr ? "STRENGTH 🟥" : isAgi ? "AGILITY 🟩" : isInt ? "INTELLIGENCE 🟦" : "UNIVERSAL 🟪";
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
                        data: rankData,
                        backgroundColor: 'rgba(220, 38, 38, 0.6)',
                        borderColor: 'rgba(220, 38, 38, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
                        x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // --- LOGIKA STRATEGI OTOMATIS BERDASARKAN ATRIBUT JIKA BELUM DI INPUT ---
            let strategy = strategyDb[query];
            
            if (!strategy) {
                if (isAgi) {
                    strategy = {
                        skills: `Hero berbasis Agility dengan tipe damage serangan ${hero.attack_type}.`,
                        synergy: "Hero dengan Buff Physical Damage (Magnus, Vengeful Spirit) atau heavy stunner.",
                        counters: ["Axe", "Razor", "Lion"],
                        counters_desc: "Hero disabilitas instan (Lion Hex) atau perusak armor dan pencuri physical damage (Razor).",
                        items: ["ghost", "blade_mail", "monkey_king_bar"],
                        items_desc: "Ghost Scepter (Kebal serangan fisik), Blade Mail (Pantulkan burst damage), MKB jika musuh memiliki evasion."
                    };
                } else if (isInt) {
                    strategy = {
                        skills: `Hero berbasis Intelligence dengan tipe output serangan ${hero.attack_type}.`,
                        synergy: "Hero tank garis depan pelindung area belakang (Axe, Centaur, Tidehunter).",
                        counters: ["Anti-Mage", "Nyx Assassin", "Silencer"],
                        counters_desc: "Anti-Mage (Mana Void instan kill), Nyx (Mana Burn konstan), Silencer (Mencegah pengeluaran spell combo).",
                        items: ["black_king_bar", "orchid", "glimmer_cape"],
                        items_desc: "Black King Bar (Mencegah kuncian spell magic), Orchid (Silence musuh sebelum bergerak), Glimmer Cape."
                    };
                } else {
                    strategy = {
                        skills: `Hero bertipe Strength / Universal dengan tipe serangan ${hero.attack_type}.`,
                        synergy: "Hero Crowd Control area luas penunjang follow-up hit (Faceless Void, Enigma).",
                        counters: ["Necrophos", "Timbersaw", "Slark"],
                        counters_desc: "Necrophos (Scythe pemotong HP tebal), Timbersaw (Pure damage penghancur Armor Strength), Slark (Pencuri stat).",
                        items: ["spirit_vessel", "silver_edge", "skadi"],
                        items_desc: "Spirit Vessel (Mengurangi regenerasi HP tebal), Silver Edge (Mematikan kemampuan pasif pertahanan), Eye of Skadi."
                    };
                }
            }

            document.getElementById('heroSkills').innerText = strategy.skills;
            document.getElementById('heroSynergy').innerText = strategy.synergy;
            document.getElementById('heroCounters').innerText = strategy.counters_desc;
            document.getElementById('itemCounters').innerText = strategy.items_desc;

            // Render Foto Hero Counter
            const heroCounterBox = document.getElementById('heroCountersImages');
            heroCounterBox.innerHTML = '';
            strategy.counters.forEach(cName => {
                const targetHero = heroes.find(h => h.localized_name.toLowerCase() === cName.toLowerCase());
                if(targetHero) {
                    const img = document.createElement('img');
                    img.src = `https://cdn.cloudflare.steamstatic.com${targetHero.img}`;
                    img.title = targetHero.localized_name;
                    img.className = "h-11 w-auto rounded border border-gray-700 shadow";
                    heroCounterBox.appendChild(img);
                }
            });

            // Render Foto Item Counter
            const itemCounterBox = document.getElementById('itemCountersImages');
            itemCounterBox.innerHTML = '';
            strategy.items.forEach(itemName => {
                const img = document.createElement('img');
                img.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${itemName}.png`;
                img.title = itemName.replace('_', ' ');
                img.className = "h-11 w-auto rounded border border-gray-700 shadow";
                itemCounterBox.appendChild(img);
            });

        } else {
            alert("Hero tidak ditemukan! Gunakan ejaan resmi Inggris (Misal: Night Stalker, Shadow Fiend).");
        }
    } catch (error) {
        console.error(error);
        alert("Gagal memuat data.");
    }
}
