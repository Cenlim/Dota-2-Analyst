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
        // Ambil data statistik dari OpenDota API
        const responseOpendota = await fetch('https://api.opendota.com/api/heroStats');
        const heroes = await responseOpendota.json();
        
        // Ambil data strategi mendetail dari file JSON eksternal kita
        const responseStrategy = await fetch('dota_strategy.json');
        const localDb = await responseStrategy.json();
        
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

            // --- AMBIL DATA DARI JSON ATAU JALANKAN GENERATOR OTOMATIS ---
            let strategy = localDb[query];
            
            if (!strategy) {
                // Generator Cadangan Otomatis Berdasarkan Atribut jika di JSON belum ditulis
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
            alert("Hero tidak ditemukan! Gunakan ejaan resmi Inggris.");
        }
    } catch (error) {
        console.error(error);
        alert("Gagal memuat data strategi.");
    }
}
